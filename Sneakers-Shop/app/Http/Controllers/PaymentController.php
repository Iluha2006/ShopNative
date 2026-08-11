<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Services\PaymentServices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    private PaymentServices $paymentServices;

    public function __construct(PaymentServices $paymentServices)
    {
        $this->paymentServices = $paymentServices;
    }

    public function createPayment(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string',
        ]);

        $user = Auth::user();
        $product = Product::findOrFail($request->product_id);
        if ($product->quantity < $request->quantity) {
            return response()->json([
                'error' => 'Недостаточное количество товара на складе'
            ], 400);
        }

        $order = $this->paymentServices->createOrder(
            $user,
            $product,
            $request->quantity,
            $request->size
        );


        $checkout = $this->paymentServices->createCheckoutSession($order, $user);

        return response()->json([
            'url' => $checkout->url,
            'session_id' => $checkout->id,
            'order_id' => $order->id,

        ]);
    }

    public function successPayment(Request $request)
    {
        $sessionId = $request->get('session_id');

        try {
            $session = $this->paymentServices->getSession($sessionId);
            $order = Order::find($session->metadata['order_id'] ?? null);
            $paid = $session->payment_status === 'paid';

            if ($order && $paid) {
                $order->markAsPaid();
            }

            return response()->json([
                'paid' => $paid,
                'order' => $order,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Ошибка проверки платежа'], 500);
        }
    }

    public function cancelPayment(Request $request)
    {
        $orderId = $request->get('order_id');
        $order = Order::find($orderId);

        if ($order) {
            $order->markAsCancelled();
        }

        return response()->json(['message' => 'Платеж отменен']);
    }


}