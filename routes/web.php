<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
// ── Guest routes ──────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login',    [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login',   [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

// ── Freelancer authenticated routes ───────────────────────────
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Placeholders — filled in per phase
    // Route::get('/leads',     fn() => Inertia::render('Leads/Index'))->name('leads.index');
    // Route::get('/proposals', fn() => Inertia::render('Proposals/Index'))->name('proposals.index');
    // Route::get('/contracts', fn() => Inertia::render('Contracts/Index'))->name('contracts.index');
    // Route::get('/invoices',  fn() => Inertia::render('Invoices/Index'))->name('invoices.index');
    // Route::get('/clients',   fn() => Inertia::render('Clients/Index'))->name('clients.index');
    // Route::get('/time',      fn() => Inertia::render('Time/Index'))->name('time.index');
});
