<?php

use App\Http\Controllers\PropertyController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Api\PropertyMapController;
use App\Http\Controllers\Paypal\PayPalController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('public/welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'membership'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('properties')->group(function () {
        Route::get('/', [PropertyController::class, 'index'])->name('properties.index');
        Route::get('/create', [PropertyController::class, 'create'])->name('properties.create');
        Route::get('/create-lite', [PropertyController::class, 'createLite'])->name('properties.create-lite');
        Route::post('/', [PropertyController::class, 'store'])->name('properties.store');
        Route::get('/{property}', [PropertyController::class, 'show'])->name('properties.show');
        Route::get('/view/{property}', [PropertyController::class, 'view'])->name('properties.view');
        Route::put('/{property}', [PropertyController::class, 'update'])->name('properties.update');
        Route::delete('/{property}', [PropertyController::class, 'destroy'])->name('properties.destroy');
    });
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('users.index');
        Route::get('/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/', [UserController::class, 'store'])->name('users.store');
        Route::get('/{user}', [UserController::class, 'show'])->name('users.show');
        Route::put('/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
    // Map preview page (public)
    Route::get('/map/preview', function () {
        return Inertia::render('public/map-preview');
    })->name('map.preview');
});
Route::middleware(['auth'])->group(function () {
    Route::post('/paypal/create-order', [PayPalController::class, 'createOrder']);
    Route::post('/paypal/capture-order', [PayPalController::class, 'captureOrder']);
});


// Lightweight API endpoints for the map
Route::prefix('api')->middleware(['auth','membership'])->group(function () {
    Route::get('/properties/in-bounds', [PropertyMapController::class, 'inBounds']);
    Route::get('/properties/all-locations', [PropertyMapController::class, 'allLocations']);
    Route::get('/properties/last-update', [PropertyMapController::class, 'lastUpdate']);
    Route::get('/properties/filters', [PropertyMapController::class, 'filters']);
    Route::get('/properties/search', [PropertyMapController::class, 'search']);
    // Protect clearCache behind auth if needed
    Route::middleware(['auth'])->post('/properties/clear-cache', [PropertyMapController::class, 'clearCache']);
});

// Map preview page (public)
Route::get('membership/required', function () {
    return Inertia::render('public/membership/required');
})->name('membership.required');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';


