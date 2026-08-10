<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuthLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuthLogController extends Controller
{
    // Muestra el historial de inicios y cierres de sesión
    public function index(Request $request): Response
    {
        $query = AuthLog::with('user:id,first_name,last_name,email')->latest('login_at');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        $authLogs = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/auth-logs/index', [
            'authLogs' => $authLogs,
            'filters' => $request->only(['search']),
        ]);
    }
}
