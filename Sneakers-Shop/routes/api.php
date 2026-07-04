<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoriteController;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\ProductController;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\CartController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/payment/create', [PaymentController::class, 'createPayment']);
    Route::get('/payment/success', [PaymentController::class, 'successPayment']);
    Route::get('/payment/cancel', [PaymentController::class, 'cancelPayment']);
});

Route::prefix('products')->group(function () {

    Route::get('/', [ProductController::class, 'index']);


    Route::post('/', [ProductController::class, 'store']);

    Route::post('/images', [ProductController::class, 'ProductImages']);

    Route::get('/{id}', [ProductController::class, 'show']);


    Route::put('/{id}', [ProductController::class, 'update']);
    Route::patch('/{id}', [ProductController::class, 'update']);


    Route::delete('/{id}', [ProductController::class, 'destroy']);

    Route::get('/category/{categoryId}', [ProductController::class, 'byCategory']);




});


Route::prefix('auth')->group(function () {


    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});


Route::middleware('auth:sanctum')->group(function () {



    Route::prefix('cart')->group(function () {
        Route::get('/', [FavoriteController::class, 'index']);
        Route::post('/add', [FavoriteController::class, 'addFavorite']);
        Route::delete('/clear', [FavoriteController::class, 'clearFavorite']);
        Route::delete('/{productId}', [FavoriteController::class, 'delete']);
        Route::get('/check/{productId}', [FavoriteController::class, 'checkFavorite']);
    });


});


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    Route::prefix('favorites')->group(function () {
        Route::get('/', [FavoriteController::class, 'index']);
        Route::post('/add', [FavoriteController::class, 'addFavorite']);
        Route::delete('/clear', [FavoriteController::class, 'clearFavorite']);
        Route::delete('/{productId}', [FavoriteController::class, 'delete']);
        Route::get('/check/{productId}', [FavoriteController::class, 'checkFavorite']);
    });


});


Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('profile')->group(function () {
        Route::put('/update/{id}', [ProfileController::class, 'update']);
        Route::get('/{id}', [ProfileController::class, 'show']);
        Route::post('/avatar', [ProfileController::class, 'updateAvatar']);
        Route::delete('/{id}', [ProfileController::class, 'destroy']);
    });

});

Route::middleware('auth:sanctum')->prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index']);

    Route::post('/add', [CartController::class, 'addToCart']);
    Route::post('/increment/{id}', [CartController::class, 'increment']);
    Route::post('/decrement/{id}', [CartController::class, 'decrement']);
    Route::delete('/delete/{id}', [CartController::class, 'delete']);
    Route::delete('/clear', [CartController::class, 'clear']);
});
