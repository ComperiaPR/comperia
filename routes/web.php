<?php

use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyExportController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AuthLogController;
use App\Http\Controllers\Api\PropertyMapController;
use App\Http\Controllers\Paypal\PayPalController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('public/welcome');
})->name('home');

// Accesible tanto para visitantes públicos como para usuarios autenticados
Route::post('/contact-messages', [ContactMessageController::class, 'store'])->name('contact-messages.store');

Route::middleware(['auth', 'verified', 'membership'])->group(function () {
    Route::get('dashboard', function () {
        $lastPayment = auth()->user()->user_payments()->with('plan')->latest('date_finish')->first();

        return Inertia::render('dashboard', [
            'lastPayment' => $lastPayment,
        ]);
    })->name('dashboard');

    Route::prefix('properties')->group(function () {
        Route::get('/', [PropertyController::class, 'index'])->name('properties.index');
        Route::get('/view/list', [PropertyController::class, 'list'])->name('properties.list');
        Route::get('/basic-search', [PropertyController::class, 'basicSearch'])->name('properties.basic-search');
        Route::get('/create', [PropertyController::class, 'create'])->name('properties.create');
        Route::get('/create-lite', [PropertyController::class, 'createLite'])->name('properties.create-lite');
        Route::get('/export-properties', [PropertyController::class, 'exportProperties'])->name('properties.export-properties');
        Route::post('/', [PropertyController::class, 'store'])->name('properties.store');
        Route::get('/{property}', [PropertyController::class, 'show'])->name('properties.show');
        Route::get('/view/{property}', [PropertyController::class, 'view'])->name('properties.view');
        Route::get('/export/pdf/{property}', [PropertyExportController::class, 'pdf'])->name('properties.export.pdf');
        Route::get('/export/excel/{property}', [PropertyExportController::class, 'excel'])->name('properties.export.excel');
        Route::get('/export/word/{property}', [PropertyExportController::class, 'word'])->name('properties.export.word');
        Route::post('/{property}/improvements', [ContactMessageController::class, 'storeImprovement'])->name('properties.improvements.store');
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
        Route::patch('/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::get('/{user}/payments', [UserController::class, 'payments'])->name('users.payments');
    });
    Route::prefix('contacts')->group(function () {
        Route::get('/', [ContactMessageController::class, 'index'])->name('contacts.index');
    });
    Route::get('/auth-logs', [AuthLogController::class, 'index'])->name('auth-logs.index');
    // Map preview page (public)
    Route::get('/map/preview', function () {
        return Inertia::render('public/map-preview');
    })->name('map.preview');
    Route::get('/about', function () {
        return Inertia::render('about');
    })->name('about');
    Route::get('/geolocation', function () {
        return Inertia::render('geolocation');
    })->name('geolocation');
});
Route::middleware(['auth'])->group(function () {
    Route::post('/paypal/create-order', [PayPalController::class, 'createOrder']);
    Route::post('/paypal/capture-order', [PayPalController::class, 'captureOrder']);
});


// Map Routes
Route::prefix('api')->middleware(['auth','membership'])->group(function () {
    Route::get('/properties/in-bounds', [PropertyMapController::class, 'inBounds']);
    Route::get('/properties/all-locations', [PropertyMapController::class, 'allLocations']);
    Route::get('/properties/last-update', [PropertyMapController::class, 'lastUpdate']);
    Route::get('/properties/filters', [PropertyMapController::class, 'filters']);
    Route::get('/properties/search', [PropertyMapController::class, 'search']);
    Route::post('/properties/clear-cache', [PropertyMapController::class, 'clearCache']);
});

// register membership required page
Route::get('membership/required', function () {
    return Inertia::render('public/membership/required');
})->name('membership.required');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';


