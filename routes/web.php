<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\StripeWebhookController;
use App\Models\Contract;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
// ── Guest routes ──────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
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
    Route::get('/proposals', [ProposalController::class, 'index'])->name('proposals.index');
    Route::get('/proposals/create', [ProposalController::class, 'create'])->name('proposals.create');
    Route::post('/proposals', [ProposalController::class, 'store'])->name('proposals.store');
    Route::get('/proposals/{proposal}/edit', [ProposalController::class, 'edit'])->name('proposals.edit');
    Route::patch('/proposals/{proposal}', [ProposalController::class, 'update'])->name('proposals.update');
    Route::post('/proposals/{proposal}/send', [ProposalController::class, 'send'])->name('proposals.send');
    Route::delete('/proposals/{proposal}', [ProposalController::class, 'destroy'])->name('proposals.destroy');

    // Invoices (freelancer)

    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('/invoices/{invoice}/edit', [InvoiceController::class, 'edit'])->name('invoices.edit');
    Route::patch('/invoices/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update');
    Route::post('/invoices/{invoice}/send', [InvoiceController::class, 'send'])->name('invoices.send');
    Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');

    // Contracts
    Route::get('/contracts', [ContractController::class, 'index'])->name('contracts.index');
    Route::get('/contracts/create', [ContractController::class, 'create'])->name('contracts.create');
    Route::post('/contracts', [ContractController::class, 'store'])->name('contracts.store');
    Route::get('/contracts/{contract}/edit', [ContractController::class, 'edit'])->name('contracts.edit');
    Route::patch('/contracts/{contract}', [ContractController::class, 'update'])->name('contracts.update');
    Route::post('/contracts/{contract}/send', [ContractController::class, 'send'])->name('contracts.send');
    Route::delete('/contracts/{contract}', [ContractController::class, 'destroy'])->name('contracts.destroy');
});

// Public contract signing (no auth)
Route::get('/contracts/{token}/sign', [ContractController::class, 'sign'])->name('contracts.sign');
Route::post('/contracts/{token}/sign', [ContractController::class, 'submitSignature'])->name('contracts.submit');
Route::get('/contracts/{token}/signature', function (string $token) {
    $contract = Contract::where('token', $token)->firstOrFail();

    if (! $contract->signature_path) {
        abort(404);
    }

    $path = storage_path('app/'.$contract->signature_path);

    if (! file_exists($path)) {
        abort(404);
    }

    return response()->file($path, ['Content-Type' => 'image/png']);
})->name('contracts.signature');
// Public proposal view (no auth required)
Route::get('/p/{token}', [ProposalController::class, 'view'])->name('proposals.public');
Route::post('/p/{token}/action', [ProposalController::class, 'clientAction'])->name('proposals.action');

// ── Client portal routes ──────────────────────────────────────
Route::get('/portal/invoices/{invoice}/pay', [InvoiceController::class, 'pay'])
    ->name('portal.invoices.pay');

Route::post('/portal/invoices/{invoice}/confirm-payment', [InvoiceController::class, 'confirmPayment'])
    ->name('portal.invoices.confirm-payment');

// ── Stripe webhook — NO auth, NO CSRF ────────────────────────
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle'])
    ->name('stripe.webhook');
