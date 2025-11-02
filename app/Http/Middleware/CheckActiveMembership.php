<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckActiveMembership
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Verificar si el usuario está autenticado
        if (!$user) {
            return redirect()->route('login');
        }
        // Verificar si el usuario tiene membresía
        if (!$user->hasRole('client')) {
            return $next($request);
        }

        // Verificar si la membresía está activa
        if (!$user->is_active) {
            return redirect()->route('membership.required')
                ->with('error', 'Tu membresía no está activa. Por favor, renueva tu membresía.');
        }

        // Verificar si la membresía ha expirado (Prioridad)
        if (!$user->date_finish || ($user->date_finish && $user->date_finish->isPast())) {
            return redirect()->route('membership.required')
                ->with('error', 'Tu membresía ha expirado. Por favor, renuévala para continuar.');
        }

        return $next($request);
    }
}
