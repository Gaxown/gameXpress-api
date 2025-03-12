<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $categories_count = Category::count();
        $products_count = Product::count();
        $users_count = User::count();
        return response()->json([
            'categories_count' => $categories_count,
            'products_count' => $products_count,
            'users_count' => $users_count,
        ]);
    }
}
