<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\Payment;
use App\Models\User;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\PaymentIntent;
class PaymentServices
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    private function convertToCents($amount): int
    {
        return (int)($amount * 100);
    }

    public function createOrder(User $user, Product $product, int $quantity, $size): Order
    {
        $totalAmount = $product->price * $quantity;

        return Order::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
            'selected_size' => $size,
            'total_amount' => $totalAmount,
            'status' => 'pending',
        ]);
    }


    public function createPaymentIntent(Order $order, User $user)
{

    $product = $order->product;


    $intent = PaymentIntent::create([
        'amount' => $this->convertToCents($order->total_amount),
        'currency' => 'rub',
        'payment_method_types' => ['card'],
        'description' => "Покупка: {$product->name} (размер: {$order->selected_size}, кол-во: {$order->quantity})",
        'receipt_email' => $user->email ?? null,
        'metadata' => [
            'order_id' => $order->id,
            'user_id' => $user->id,  'product_id' => $product->id,
            'product_name' => $product->name,
        ],
    ]);

    return [
        'client_secret' => $intent->client_secret,
        'order_id' => $order->id,
    ];
}

    public function getSession(string $sessionId): Session
    {
        return Session::retrieve($sessionId);
    }

}