<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:auth');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth');
});

Route::get('/books/genres', [BookController::class, 'genres']);
Route::apiResource('books', BookController::class)->only(['index', 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::get('/profile/reviews', [ProfileController::class, 'reviews']);

    Route::apiResource('books', BookController::class)->only(['store', 'update', 'destroy']);
    Route::post('/books/{book}/reviews', [ReviewController::class, 'store'])
        ->middleware('throttle:reviews');
    Route::apiResource('reviews', ReviewController::class)->only(['update', 'destroy']);
});
