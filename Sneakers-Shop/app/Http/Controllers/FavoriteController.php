<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{


    public function index()
    {

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Пользователь не авторизован'
            ], 401);
        }

        $favorites = Favorite::where('user_id', $user->id)
            ->with(['product' => function($query) {
                $query->with('images');
            }])
            ->get();

        return response()->json([
            'success' => true,
            'favorites' => $favorites
        ]);
    }

    public function addFavorite(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);


        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Пользователь не авторизован'
            ], 401);
        }

        $userId = $user->id;
        $productId = $request->input('product_id');


        $existingFavorite = Favorite::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($existingFavorite) {
            return response()->json([
                'success' => false,
                'message' => 'Товар уже в вашем избранном'
            ], 400);
        }


        $favorite = Favorite::create([
            'user_id' => $userId,
            'product_id' => $productId
        ]);

        $favorite->load('product');

        return response()->json([
            'success' => true,
            'message' => 'Товар добавлен в избранное',
            'favorite' => $favorite
        ], 201);
    }

    public function clearFavorite()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Пользователь не авторизован'
            ], 401);
        }


        $deleted = Favorite::where('user_id', $user->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Все товары удалены из избранного',
            'deleted_count' => $deleted
        ]);
    }

    public function delete($productId)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Пользователь не авторизован'
            ], 401);
        }


        $favorite = Favorite::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if (!$favorite) {
            return response()->json([
                'success' => false,
                'message' => 'Товар не найден в вашем избранном'
            ], 404);
        }

        $favorite->delete();

        return response()->json([
            'success' => true,
            'message' => 'Товар удален из избранного'
        ]);
    }

    public function checkFavorite($productId)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Пользователь не авторизован'
            ], 401);
        }


        $isFavorite = Favorite::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();

        return response()->json([
            'success' => true,
            'is_favorite' => $isFavorite
        ]);
    }
}