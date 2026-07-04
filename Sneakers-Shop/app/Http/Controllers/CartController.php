<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{

    public function index()
    {
        $userId = Auth::id();
        $cartItems = Cart::where('user_id', $userId)
            ->with('product')
            ->get();
        return response()->json([
            'success' => true,
            'data' => $cartItems
        ]);
    }


    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'size' => 'required|string',
            'selected_image' => 'nullable|string',
            'quantity' => 'integer|min:1|max:100'
        ]);

        $userId = Auth::id();
        $productId = $request->product_id;
        $size = $request->size;
        $imageProd= $request->selected_image;
        $quantity = $request->quantity ?? 1;


        $cartItem = Cart::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('size', $size)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $quantity);
        } else {
            $cartItem = Cart::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'size'=> $size,
                'quantity' => $quantity,
                'selected_image' => $imageProd
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Товар добавлен в корзину',
            'data' => $cartItem->load('product')
        ]);
    }


    public function increment($id)
    {
        $userId = Auth::id();

        $cartItem = Cart::where('user_id', $userId)
            ->where('id', $id)
            ->with('product')
            ->first();

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Товар не найден в корзине'
            ], 404);
        }


        if ($cartItem->quantity >= $cartItem->product->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Достигнуто максимальное количество товара',
                'available' => $cartItem->product->quantity
            ], 422);
        }

        $cartItem->increment('quantity');

        return response()->json([
            'success' => true,
            'message' => 'Количество увеличено',
            'data' => $cartItem->load('product')
        ]);
    }


    public function decrement($id)
    {
        $userId = Auth::id();

        $cartItem = Cart::where('user_id', $userId)
            ->where('id', $id)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Товар не найден в корзине'
            ], 404);
        }

        if ($cartItem->quantity <= 1) {
            return response()->json([
                'success' => false,
                'message' => 'Количество не может быть меньше 1'
            ], 422);
        }

        $cartItem->decrement('quantity');

        return response()->json([
            'success' => true,
            'message' => 'Количество уменьшено',
            'data' => $cartItem->load('product')
        ]);
    }

    public function delete($id)
    {
        $userId = Auth::id();

        $cartItem = Cart::where('user_id', $userId)
            ->where('id', $id)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Товар не найден в корзине'
            ], 404);
        }

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Товар удален из корзины'
        ]);
    }


    public function clear()
    {
        $userId = Auth::id();

        $deleted = Cart::where('user_id', $userId)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Корзина очищена',
            'deleted_count' => $deleted
        ]);
    }


}