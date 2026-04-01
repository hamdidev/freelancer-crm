<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\Portal\MagicLinkController;
use App\Http\Controllers\Portal\PortalContractController;
use App\Http\Controllers\Portal\PortalDashboardController;
use App\Http\Controllers\Portal\PortalInvoiceController;
use App\Http\Controllers\Portal\PortalProposalController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\TimeEntryController;
use App\Models\Contract;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// ── Guest routes ──────────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login',    [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login',   [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

// ── Freelancer authenticated routes ──────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Leads
    Route::get('/leads',                  [LeadController::class, 'index'])->name('leads.index');
    Route::post('/leads',                 [LeadController::class, 'store'])->name('leads.store');
    Route::patch('/leads/{lead}',         [LeadController::class, 'update'])->name('leads.update');
    Route::patch('/leads/{lead}/status',  [LeadController::class, 'updateStatus'])->name('leads.status');
    Route::delete('/leads/{lead}',        [LeadController::class, 'destroy'])->name('leads.destroy');

    // Proposals
    Route::get('/proposals',                      [ProposalController::class, 'index'])->name('proposals.index');
    Route::get('/proposals/create',               [ProposalController::class, 'create'])->name('proposals.create');
    Route::post('/proposals',                     [ProposalController::class, 'store'])->name('proposals.store');
    Route::get('/proposals/{proposal}/edit',      [ProposalController::class, 'edit'])->name('proposals.edit');
    Route::patch('/proposals/{proposal}',         [ProposalController::class, 'update'])->name('proposals.update');
    Route::post('/proposals/{proposal}/send',     [ProposalController::class, 'send'])->name('proposals.send');
    Route::delete('/proposals/{proposal}',        [ProposalController::class, 'destroy'])->name('proposals.destroy');

    // Invoices
    Route::get('/invoices',                   [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/invoices/create',            [InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('/invoices',                  [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('/invoices/{invoice}/edit',    [InvoiceController::class, 'edit'])->name('invoices.edit');
    Route::patch('/invoices/{invoice}',       [InvoiceController::class, 'update'])->name('invoices.update');
    Route::post('/invoices/{invoice}/send',   [InvoiceController::class, 'send'])->name('invoices.send');
    Route::delete('/invoices/{invoice}',      [InvoiceController::class, 'destroy'])->name('invoices.destroy');

    // Contracts
    Route::get('/contracts',                  [ContractController::class, 'index'])->name('contracts.index');
    Route::get('/contracts/create',           [ContractController::class, 'create'])->name('contracts.create');
    Route::post('/contracts',                 [ContractController::class, 'store'])->name('contracts.store');
    Route::get('/contracts/{contract}/edit',  [ContractController::class, 'edit'])->name('contracts.edit');
    Route::patch('/contracts/{contract}',     [ContractController::class, 'update'])->name('contracts.update');
    Route::post('/contracts/{contract}/send', [ContractController::class, 'send'])->name('contracts.send');
    Route::delete('/contracts/{contract}',    [ContractController::class, 'destroy'])->name('contracts.destroy');

    // Freelancer-side: send magic link to a client
    Route::post('/portal/send', [MagicLinkController::class, 'send'])->name('portal.send');


    // Time tracking
    Route::get('/time',                        [TimeEntryController::class, 'index'])->name('time.index');
    Route::post('/time/start',                 [TimeEntryController::class, 'start'])->name('time.start');
    Route::patch('/time/{entry}/stop',         [TimeEntryController::class, 'stop'])->name('time.stop');
    Route::patch('/time/{entry}',              [TimeEntryController::class, 'update'])->name('time.update');
    Route::post('/time/{entry}/sync',          [TimeEntryController::class, 'sync'])->name('time.sync');
    Route::delete('/time/{entry}',             [TimeEntryController::class, 'destroy'])->name('time.destroy');
});

// ── Public routes (no auth) ───────────────────────────────────────────────────

// Contract signing
Route::get('/contracts/{token}/sign',      [ContractController::class, 'sign'])->name('contracts.sign');
Route::post('/contracts/{token}/sign',     [ContractController::class, 'submitSignature'])->name('contracts.submit');
Route::get('/contracts/{token}/signature', function (string $token) {
    $contract = Contract::where('token', $token)->firstOrFail();
    if (! $contract->signature_path) abort(404);
    $path = storage_path('app/' . $contract->signature_path);
    if (! file_exists($path)) abort(404);
    return response()->file($path, ['Content-Type' => 'image/png']);
})->name('contracts.signature');

// Public proposal view
Route::get('/p/{token}',         [ProposalController::class, 'view'])->name('proposals.public');
Route::post('/p/{token}/action', [ProposalController::class, 'clientAction'])->name('proposals.action');

// ── Client portal — magic link entry points (no auth) ────────────────────────
Route::get('/portal/auth/{token}', [MagicLinkController::class, 'authenticate'])
    ->name('portal.authenticate');

Route::inertia('/portal/session-expired', 'Portal/SessionExpired')
    ->name('portal.session-expired');

// ── Client portal — protected routes (client guard) ──────────────────────────
Route::prefix('portal')
    ->name('portal.')
    ->middleware('client.auth')
    ->group(function () {
        Route::get('/dashboard',                          [PortalDashboardController::class, 'index'])->name('dashboard');

        // Route::get('/proposals',                          [PortalProposalController::class, 'index'])->name('proposals.index');
        // Route::get('/proposals/{proposal}',               [PortalProposalController::class, 'show'])->name('proposals.show');

        // Route::get('/invoices',                           [PortalInvoiceController::class, 'index'])->name('invoices.index');
        // Route::get('/invoices/{invoice}/pdf',             [PortalInvoiceController::class, 'pdf'])->name('invoices.pdf');
        // Route::get('/invoices/{invoice}/pay',             [PortalInvoiceController::class, 'pay'])->name('invoices.pay');
        // Route::post('/invoices/{invoice}/confirm-payment',[PortalInvoiceController::class, 'confirmPayment'])->name('invoices.confirm-payment');

        // Route::get('/contracts',                          [PortalContractController::class, 'index'])->name('contracts.index');
        // Route::post('/contracts/{contract}/sign',         [PortalContractController::class, 'sign'])->name('contracts.sign');

        Route::post('/logout', [MagicLinkController::class, 'logout'])->name('logout');
    });

// ── Stripe webhook — NO auth, NO CSRF ────────────────────────────────────────
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle'])
    ->name('stripe.webhook');
