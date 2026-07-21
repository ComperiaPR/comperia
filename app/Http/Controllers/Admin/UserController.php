<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RolesEnum;
use App\Enums\UserTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Http\Requests\Admin\UserUpdateRequest;
use App\Models\Municipality;
use App\Models\Plan;
use App\Models\User;
use App\Models\UserPayment;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Response;
use Inertia\Inertia;

class UserController extends Controller
{
    // Muestra una lista de usuarios
    public function index(Request $request): Response
    {
        
        $query = User::with(['roles','municipality']);

        // Filtro por búsqueda de texto (nombre o email)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtro por roles (array)
        if ($request->filled('roles') && is_array($request->input('roles'))) {
            $roles = $request->input('roles');
            $query->whereHas('roles', function ($q) use ($roles) {
                $q->whereIn('name', $roles);
            });
        }

        // Filtro por estados (array)
        if ($request->filled('statuses') && is_array($request->input('statuses'))) {
            $statuses = $request->input('statuses');
            $query->where(function ($q) use ($statuses) {
                foreach ($statuses as $status) {
                    if ($status === 'active') {
                        $q->orWhere('is_active', true);
                    } elseif ($status === 'inactive') {
                        $q->orWhere('is_active', false);
                    } elseif ($status === 'verified') {
                        $q->orWhereNotNull('email_verified_at');
                    } elseif ($status === 'unverified') {
                        $q->orWhereNull('email_verified_at');
                    }
                }
            });
        }

        $users = $query->paginate(10)
            ->withQueryString() // Mantener los parámetros de filtro en la paginación
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'company_name' => $user->company_name,
                    'address_main' => $user->address_main,
                    'address_secondary' => $user->address_secondary,
                    'municipality' => $user->municipality ? [
                        'id' => $user->municipality->id,
                        'name' => $user->municipality->name,
                    ] : null,
                    'cell_number' => $user->cell_number,
                    'phone_number' => $user->phone_number,
                    'email' => $user->email,
                    'account_type' => $user->account_type,
                    'email_verified_at' => $user->email_verified_at,
                    'roles' => $user->roles->map(function ($role) {
                        return [
                            'id' => $role->id,
                            'name' => $role->name,
                            'label' => RolesEnum::labels()[$role->name] ?? $role->name,
                        ];
                    }),
                    'is_active' => $user->is_active,
                    'date_start' => $user->date_start ? $user->date_start->toDateString() : null,
                    'date_finish' => $user->date_finish ? $user->date_finish->toDateString() : null,
                ];
            });

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'roles' => RolesEnum::labels(),
            'filters' => $request->only(['search', 'roles', 'statuses']),
        ]);
    }

    // Muestra el formulario para crear un nuevo usuario
    public function create()
    {
        // Gate::authorize(PermissionsEnum::CreateProperties);
        $municipalities = Municipality::get();

        return Inertia::render('admin/users/create',[
            'municipalities' => $municipalities,
            'roles' => RolesEnum::labels(),
            'account_types' => UserTypeEnum::labels(),
            'plans' => Plan::where('is_active', true)->orderBy('name')->get(['id', 'name', 'price', 'days']),
        ]);
    }

    // Almacena un nuevo usuario
    public function store(UserStoreRequest $request)
    {
        
        DB::beginTransaction();

        try {

            $user = User::create([
                'document' => $request->document,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'company_name' => $request->company_name,
                'municipality_id' => $request->municipality_id,
                'zip_code' => $request->zip_code,
                'account_type' => $request->account_type,
                'email' => $request->email,
                'username' => $request->email,
                'password' => Hash::make($request->password),
                'address_main' => $request->address_main,
                'address_secondary' => $request->address_secondary,
                'phone_number' => $request->phone_number,
                'cell_number' => $request->cell_number,
                'date_start' => $request->date_start,
                'date_finish' => $request->date_finish,
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            $user->assignRole($request->role);

            if ($request->role === RolesEnum::Client->value && $request->filled('plan_id')) {
                $this->registerPayment($user, $request->plan_id, $request->date_start, $request->date_finish);
            }

            DB::commit();

            return redirect()->route('users.create');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors(['error' => 'No se pudo crear el usuario.'.$th->getMessage()]);
        }
    }

    /**
     * Registra un nuevo pago manual (creado desde el panel de administración,
     * no vía PayPal) y sincroniza la ventana de membresía del usuario.
     * Si no se indican fechas, la fecha de inicio continúa desde el fin del
     * último pago vigente (o "ahora" si no tiene ninguno).
     */
    private function registerPayment(User $user, int $planId, ?string $dateStart, ?string $dateFinish): void
    {
        $plan = Plan::findOrFail($planId);

        if (! $dateStart) {
            $lastPayment = $user->user_payments()->latest('date_finish')->first();
            $dateStart = $lastPayment?->date_finish ?? now();
        }

        $dateStart = Carbon::parse($dateStart);
        $dateFinish = $dateFinish ? Carbon::parse($dateFinish) : $dateStart->copy()->addDays($plan->days);

        UserPayment::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'payment_type_id' => null,
            'date_start' => $dateStart,
            'date_finish' => $dateFinish,
            'order_id' => 'ADMIN-' . Str::uuid(),
            'status' => 'MANUAL',
            'amount' => $plan->price,
            'currency' => 'USD',
        ]);

        $user->date_start = $dateStart;
        $user->date_finish = $dateFinish;
        $user->save();
    }

    // Muestra un usuario específico
    public function show(User $user) : Response
    {
        // Gate::authorize(PermissionsEnum::CreateProperties);
        $municipalities = Municipality::get();
        $user->role = $user->getRoleNames()[0];

        $lastPayment = $user->user_payments()->with('plan')->latest('date_finish')->first();

        return Inertia::render('admin/users/update',[
            'user' => $user,
            'municipalities' => $municipalities,
            'roles' => RolesEnum::labels(),
            'account_types' => UserTypeEnum::labels(),
            'plans' => Plan::where('is_active', true)->orderBy('name')->get(['id', 'name', 'price', 'days']),
            'lastPayment' => $lastPayment,
        ]);
    }

    // Actualiza un usuario específico
    public function update(User $user, UserUpdateRequest $request)
    {
        DB::beginTransaction();
        try {

            $updateData = [
                'document' => $request->document,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'company_name' => $request->company_name,
                'municipality_id' => $request->municipality_id,
                'zip_code' => $request->zip_code,
                'account_type' => $request->account_type,
                'email' => $request->email,
                'username' => $request->email,
                'address_main' => $request->address_main,
                'address_secondary' => $request->address_secondary,
                'phone_number' => $request->phone_number,
                'cell_number' => $request->cell_number,
                'date_start' => $request->date_start,
                'date_finish' => $request->date_finish,
            ];

            // Solo actualizar la contraseña si el admin escribió una nueva.
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);


            // Actualizar rol si cambió
            if ($request->filled('role')) {
                $user->syncRoles([$request->input('role')]);
            }

            if ($request->boolean('add_payment') && $request->filled('plan_id')) {
                $this->registerPayment($user, (int) $request->plan_id, $request->date_start, $request->date_finish);
            }

            DB::commit();

            return redirect()->route('users.index');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    // Elimina un usuario específico
    public function destroy($id)
    {
        // ...implementación...
    }

    // Muestra el historial de pagos y el plan actual de un usuario
    public function payments(User $user): Response
    {
        $payments = $user->user_payments()
            ->with(['plan', 'payment_type'])
            ->orderByDesc('date_start')
            ->get();

        return Inertia::render('admin/users/payments', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'is_active' => $user->is_active,
                'date_start' => $user->date_start,
                'date_finish' => $user->date_finish,
            ],
            'currentPlan' => $payments->first()?->plan,
            'payments' => $payments,
        ]);
    }

    public function toggleStatus(User $user): RedirectResponse
    {
        try {
            $user->update(['is_active' => !$user->is_active]);

            $message = $user->is_active ? 'Usuario habilitado con éxito.' : 'Usuario deshabilitado con éxito.';

            return redirect()->route('admin.users.index')->with('success', $message);
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'No se pudo cambiar el estado del usuario.']);
        }
    }
}
