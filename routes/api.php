<?php
use App\Http\Controllers\MetaEventController;
use Illuminate\Support\Facades\Route;

Route::prefix('meta')->group(function () {
    Route::post('/page-view',   [MetaEventController::class, 'pageView']);
    Route::post('/add-to-cart', [MetaEventController::class, 'addToCart']);
    Route::post('/purchase',    [MetaEventController::class, 'purchase']);
});