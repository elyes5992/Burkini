<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;

use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;




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

Route::get('/pyjamas', [ProductController::class, 'pyjamas'])->name('pyjamas');
Route::get('/survetements', [ProductController::class, 'survetements'])->name('survetements');

Route::get('/chemises', [ProductController::class, 'chemises'])->name('chemises');

Route::get('/panier', [CartController::class, 'index'])->name('cart');
Route::post('/panier/ajouter', [CartController::class, 'add'])->name('cart.add');
Route::patch('/panier/{key}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/panier/{key}', [CartController::class, 'remove'])->name('cart.remove');
Route::delete('/panier', [CartController::class, 'clear'])->name('cart.clear');

Route::get('/panier/json', [CartController::class, 'json'])->name('cart.json');

Route::get('/livraison-et-retours', function () {
    return Inertia::render('LivraisonRetours');
})->name('livraison');

Route::get('/guide-des-tailles', function () {
    return Inertia::render('GuideTailles');
})->name('guide-tailles');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/stats', [StatsController::class, 'index'])->name('admin.stats');
        // 🔥 AJOUTÉ : Parcours d'un visiteur
        Route::get('/stats/visitor/{visitorId}/journey', [StatsController::class, 'visitorJourney'])
            ->name('admin.stats.visitor.journey');
        Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
        Route::get('/products/create', [AdminProductController::class, 'create'])->name('products.create');
        Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
        Route::get('/products/{product}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
        Route::post('/products/{product}', [AdminProductController::class, 'update'])->name('products.update'); // POST for multipart/form-data support
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');

        // Quick inline toggles & image removal
        Route::patch('/products/{product}/toggle-active', [AdminProductController::class, 'toggleActive'])->name('products.toggle-active');
        Route::patch('/products/{product}/toggle-front-page', [AdminProductController::class, 'toggleFrontPage'])->name('products.toggle-front-page');
        Route::delete('/products/{product}/images/{mediaId}', [AdminProductController::class, 'deleteImage'])->name('products.images.delete');
    });



// Checkout
Route::get('/commander', [OrderController::class, 'checkout'])->name('checkout');
Route::post('/commander', [OrderController::class, 'store'])->name('order.store');

require __DIR__ . '/auth.php';
