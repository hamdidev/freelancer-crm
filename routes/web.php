<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\ProposalController;
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

    Route::get('/leads', [LeadController::class, 'index'])->name('leads.index');
    Route::post('/leads', [LeadController::class, 'store'])->name('leads.store');
    Route::patch('/leads/{lead}', [LeadController::class, 'update'])->name('leads.update');
    Route::patch('/leads/{lead}/status', [LeadController::class, 'updateStatus'])->name('leads.status');
    Route::delete('/leads/{lead}', [LeadController::class, 'destroy'])->name('leads.destroy');



    // Proposals (freelancer)
    Route::get('/proposals',                  [ProposalController::class, 'index'])->name('proposals.index');
    Route::get('/proposals/create',           [ProposalController::class, 'create'])->name('proposals.create');
    Route::post('/proposals',                 [ProposalController::class, 'store'])->name('proposals.store');
    Route::get('/proposals/{proposal}/edit',  [ProposalController::class, 'edit'])->name('proposals.edit');
    Route::patch('/proposals/{proposal}',     [ProposalController::class, 'update'])->name('proposals.update');
    Route::post('/proposals/{proposal}/send', [ProposalController::class, 'send'])->name('proposals.send');
    Route::delete('/proposals/{proposal}',    [ProposalController::class, 'destroy'])->name('proposals.destroy');
});
// Public proposal view (no auth required)
Route::get('/p/{token}',        [ProposalController::class, 'view'])->name('proposals.public');
Route::post('/p/{token}/action', [ProposalController::class, 'clientAction'])->name('proposals.action');
