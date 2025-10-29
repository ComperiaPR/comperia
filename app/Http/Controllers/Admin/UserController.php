<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RolesEnum;
use App\Enums\UserTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Models\Municipality;
use App\Models\User;
use Illuminate\Http\Request;
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
            'user_types' => UserTypeEnum::labels(),
        ]);
    }

    // Almacena un nuevo usuario
    public function store(UserStoreRequest $request)
    {
        try {
            
            $user = User::where()->first();
            if(!$user){
                $user = new User();
            }
            $user->save();
            
            
            return redirect()->route('users.create');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
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
