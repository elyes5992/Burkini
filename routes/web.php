<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;

use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::get('/', [ProductController::class, 'home'])->name('home');
Route::get('/produits', [ProductController::class, 'products'])->name('products');
Route::get('/a-propos', [ProductController::class, 'about'])->name('about');
Route::get('/produit/{id}', [ProductController::class, 'show'])->name('product.show');

Route::get('/panier', [CartController::class, 'index'])->name('cart');
Route::post('/panier/ajouter', [CartController::class, 'add'])->name('cart.add');
Route::patch('/panier/{key}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/panier/{key}', [CartController::class, 'remove'])->name('cart.remove');
Route::delete('/panier', [CartController::class, 'clear'])->name('cart.clear');

Route::get('/panier/json', [CartController::class, 'json'])->name('cart.json');

// Checkout
Route::get('/commander', [OrderController::class, 'checkout'])->name('checkout');
Route::post('/commander', [OrderController::class, 'store'])->name('order.store');

require __DIR__.'/auth.php';
