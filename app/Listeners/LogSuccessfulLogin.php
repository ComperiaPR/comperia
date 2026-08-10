<?php

namespace App\Listeners;

use App\Models\AuthLog;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

class LogSuccessfulLogin
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        if ($event->guard !== 'web') {
            return;
        }

        // Solo una sesión activa por usuario: cualquier otra sesión (otro
        // navegador/dispositivo) queda invalidada; las pestañas del mismo
        // navegador comparten esta misma sesión y no se ven afectadas.
        DB::table('sessions')
            ->where('user_id', $event->user->id)
            ->where('id', '!=', Request::session()->getId())
            ->delete();

        AuthLog::where('user_id', $event->user->id)
            ->whereNull('logout_at')
            ->update(['logout_at' => now()]);

        $log = AuthLog::create([
            'user_id' => $event->user->id,
            'email' => $event->user->email,
            'ip_address' => Request::ip(),
            'user_agent' => substr((string) Request::userAgent(), 0, 255),
            'login_at' => now(),
        ]);

        Request::session()->put('auth_log_id', $log->id);
    }
}
