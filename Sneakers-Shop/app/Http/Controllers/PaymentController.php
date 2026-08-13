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

            $order = Order::with('product')
                ->find($session->metadata['order_id'] ?? null);

            $paid = $session->payment_status === 'paid';

            if ($order && $paid) {
                $order->markAsCompleted();
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'paid' => $paid,
                    'order' => $order,
                ]);
            }

            return $this->successPage($order, $paid);
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Ошибка проверки платежа'
                ], 500);
            }

            return $this->errorPage();
        }
    }

    public function cancelPayment(Request $request)
    {
        $orderId = $request->get('order_id');
        $order = Order::find($orderId);

        if ($order) {
            $order->markAsCancelled();
        }

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Платеж отменен']);
        }

        return $this->cancelPage();
    }

    private function successPage(?Order $order, bool $paid): \Illuminate\Http\Response
    {
        if (!$paid) {
            return $this->errorPage('Оплата не была завершена. Попробуйте ещё раз.');
        }

        $number = $order ? $order->id : '';
        $amount = $order ? number_format($order->total_amount, 0, ',', ' ') . ' ₽' : '';

        $html = "
<!DOCTYPE html>
<html lang=\"ru\">
<head>
<meta charset=\"utf-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<title>Оплата прошла успешно</title>
<style>
  body { margin:0; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;
         background:#f6f7f9; display:flex; align-items:center; justify-content:center; min-height:100vh; }
  .card { background:#fff; border-radius:16px; padding:40px 32px; text-align:center;
          max-width:360px; width:88%; box-shadow:0 8px 30px rgba(0,0,0,.08); }
  .icon { font-size:56px; }
  h1 { font-size:22px; color:#222; margin:12px 0 8px; }
  p { color:#666; font-size:15px; margin:4px 0; }
  .amount { font-size:20px; font-weight:700; color:#FF9E58; margin-top:8px; }
</style>
</head>
<body>
  <div class=\"card\">
    <div class=\"icon\">✅</div>
    <h1>Оплата прошла успешно</h1>
    <p>Заказ №{$number}</p>
    <p>Сумма: {$amount}</p>
  </div>
  <script>try { window.close(); } catch (e) {}</script>
</body>
</html>";

        return response($html)->header('Content-Type', 'text/html; charset=UTF-8');
    }

    private function cancelPage(): \Illuminate\Http\Response
    {
        $html = "
<!DOCTYPE html>
<html lang=\"ru\">
<head>
<meta charset=\"utf-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<title>Платеж отменен</title>
<style>
  body { margin:0; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;
         background:#f6f7f9; display:flex; align-items:center; justify-content:center; min-height:100vh; }
  .card { background:#fff; border-radius:16px; padding:40px 32px; text-align:center;
          max-width:360px; width:88%; box-shadow:0 8px 30px rgba(0,0,0,.08); }
  .icon { font-size:56px; }
  h1 { font-size:22px; color:#222; margin:12px 0 8px; }
  p { color:#666; font-size:15px; margin:4px 0; }
</style>
</head>
<body>
  <div class=\"card\">
    <div class=\"icon\">↩️</div>
    <h1>Платеж отменен</h1>
  </div>
  <script>try { window.close(); } catch (e) {}</script>
</body>
</html>";

        return response($html)->header('Content-Type', 'text/html; charset=UTF-8');
    }

    private function errorPage(string $message = 'Ошибка проверки платежа'): \Illuminate\Http\Response
    {
        $html = "
<!DOCTYPE html>
<html lang=\"ru\">
<head>
<meta charset=\"utf-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<title>Ошибка оплаты</title>
<style>
  body { margin:0; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;
         background:#f6f7f9; display:flex; align-items:center; justify-content:center; min-height:100vh; }
  .card { background:#fff; border-radius:16px; padding:40px 32px; text-align:center;
          max-width:360px; width:88%; box-shadow:0 8px 30px rgba(0,0,0,.08); }
  .icon { font-size:56px; }
  h1 { font-size:22px; color:#222; margin:12px 0 8px; }
  p { color:#666; font-size:15px; margin:4px 0; }
</style>
</head>
<body>
  <div class=\"card\">
    <div class=\"icon\">⚠️</div>
    <h1>{$message}</h1>
  </div>
</body>
</html>";

        return response($html)->header('Content-Type', 'text/html; charset=UTF-8');
    }

}
