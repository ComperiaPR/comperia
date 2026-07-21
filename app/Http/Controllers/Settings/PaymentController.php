<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Show the user's membership and payment history.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $lastPayment = $user->user_payments()
            ->with(['plan', 'payment_type'])
            ->latest('created_at')
            ->first();

        return Inertia::render('settings/payments', [
            'membership' => [
                'is_active' => $user->is_active,
                'date_start' => $user->date_start,
                'date_finish' => $user->date_finish,
            ],
            'lastPayment' => $lastPayment,
        ]);
    }
}
