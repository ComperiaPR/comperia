<?php

namespace App\Listeners;

use App\Models\AuthLog;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Request;

class LogSuccessfulLogout
{
    /**
     * Handle the event.
     */
    public function handle(Logout $event): void
    {
        $authLogId = Request::session()->pull('auth_log_id');

        if (! $authLogId) {
            return;
        }

        AuthLog::where('id', $authLogId)->update(['logout_at' => now()]);
    }
}
