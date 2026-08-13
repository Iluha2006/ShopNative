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

    public function createOrders(array $items, User $user): \Illuminate\Support\Collection
    {
        $orders = collect();

        foreach ($items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $totalAmount = $product->price * $item['quantity'];

            $orders->push(Order::create([
                'user_id' => $user->id,
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'selected_size' => $item['size'] ?? null,
                'total_amount' => $totalAmount,
                'status' => 'pending',
            ]));
        }

        return $orders;
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

    public function createCheckoutSession($orders, User $user): Session
    {
        $orders = $orders instanceof \Illuminate\Support\Collection ? $orders : collect([$orders]);

        $lineItems = [];

        foreach ($orders as $order) {
            $product = $order->product;

            $lineItems[] = [
                'price_data' => [
                    'currency' => 'rub',
                    'product_data' => [
                        'name' => $product->name,
                        'description' => "Размер: {$order->selected_size}, кол-во: {$order->quantity}",
                    ],
                    'unit_amount' => $this->convertToCents($product->price),
                ],
                'quantity' => $order->quantity,
            ];
        }

        $orderIds = $orders->pluck('id')->all();

        $session = Session::create([
            'payment_method_types' => ['card'],
            'mode' => 'payment',
            'line_items' => $lineItems,
            'metadata' => [
                'order_ids' => implode(',', $orderIds),
                'user_id' => $user->id,
            ],
            'success_url' => config('app.url') . '/api/payment/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => config('app.url') . '/api/payment/cancel?order_ids=' . implode(',', $orderIds),
        ]);

        return $session;
    }

    public function getSession(string $sessionId): Session
    {
        return Session::retrieve($sessionId);
    }

}