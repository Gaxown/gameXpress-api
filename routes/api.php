<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth routes
Route::post('/register', 'App\Http\Controllers\AuthController@register');
Route::post('/login', [AuthController::class,  'login']);
Route::post('/logout', 'App\Http\Controllers\AuthController@logout')->middleware('auth:sanctum');


// Home route
Route::get('/dashboard', [HomeController::class, 'index'])->middleware('auth:sanctum');
// Route::get('/dashboard', 'App\Http\Controllers\HomeController@index')->middleware('auth:sanctum');


// Category routes
Route::apiResource('categories', 'App\Http\Controllers\CategoryController')->middleware('auth:sanctum');

// Product routes
Route::apiResource('products', 'App\Http\Controllers\ProductController')->middleware('auth:sanctum');
