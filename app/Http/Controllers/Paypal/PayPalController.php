<?php

namespace App\Http\Controllers\Paypal;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\User;
use App\Models\UserPayment;
use Illuminate\Http\Request;
use App\Services\PayPalService;
use Illuminate\Support\Facades\Auth;

class PayPalController extends Controller
{
    protected $paypal;

    public function __construct(PayPalService $paypal)
    {
        $this->paypal = $paypal;
    }

    public function createOrder(Request $request)
    {
        $plan = Plan::findOrFail($request->planId);
        $data = $this->paypal->createOrder($plan->price);
        return response()->json($data);
    }

    public function captureOrder(Request $request)
    {
        $data = $this->paypal->captureOrder($request->orderId);
        $result = $data;
        if (isset($result['status']) && $result['status'] === 'COMPLETED') {
            // ✅ Pago exitoso
            $purchase = $result['purchase_units'][0]['payments']['captures'][0] ?? null;
            $payer    = $result['payer'] ?? [];
            $date_start = now();
            $date_finish = now()->addDays(Plan::find($request->planId)->days);
            // Guarda en base de datos
            UserPayment::create([
                'user_id' => Auth::user()->id,
                'plan_id' => $request->planId,
                'payment_type_id' => 1, // PayPal
                'ip' => $request->ip(),
                'date_start' => $date_start,
                'date_finish' => $date_finish,
                'order_id' => $result['id'],
                'status' => $result['status'],
                'amount' => $purchase['amount']['value'] ?? 0,
                'currency' => $purchase['amount']['currency_code'] ?? 'USD',
                'payer_email' => $payer['email_address'] ?? null,
                'payer_name' => ($payer['name']['given_name'] ?? '') . ' ' . ($payer['name']['surname'] ?? ''),
                'raw_response' => json_encode($result),
            ]);

            $user = User::find(Auth::user()->id);
            $user->date_start = $date_start;
            $user->date_finish = $date_finish;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Pago completado correctamente',
                'data' => $result,
            ]);
        }

        // ❌ Pago fallido o error
        Log::error('Error en pago PayPal:', $result);

        return response()->json([
            'success' => false,
            'message' => 'Error al procesar el pago',
            'error' => $result['message'] ?? 'Desconocido',
            'data' => $result,
        ], 400);
    }
}
