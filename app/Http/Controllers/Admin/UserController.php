<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RolesEnum;
use App\Enums\UserTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Models\Municipality;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Response;
use Inertia\Inertia;

class UserController extends Controller
{
    // Muestra una lista de usuarios
    public function index(Request $request): Response
    {
        
        $query = User::with(['roles']);

        // Filtro por búsqueda de texto (nombre o email)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
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
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_active' => $user->is_active,
                    'email_verified_at' => $user->email_verified_at,
                    'roles' => $user->roles->map(function ($role) {
                        return [
                            'id' => $role->id,
                            'name' => $role->name,
                            'label' => $role->name,
                        ];
                    }),
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
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            $user->assignRole($request->role);

            DB::commit();

            return redirect()->route('users.create');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors(['error' => 'No se pudo crear el usuario.'.$th->getMessage()]);
        }
    }

    // Muestra un usuario específico
    public function show($id)
    {
        // ...implementación...
    }

    // Actualiza un usuario específico
    public function update(Request $request, $id)
    {
        // ...implementación...
    }

    // Elimina un usuario específico
    public function destroy($id)
    {
        // ...implementación...
    }
}
