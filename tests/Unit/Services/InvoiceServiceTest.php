<?php

use App\Services\InvoiceNumberService;
use App\Services\InvoiceService;
use Stripe\StripeClient;

beforeEach(function () {
    $this->service = new InvoiceService(
        new InvoiceNumberService,
        Mockery::mock(StripeClient::class),
    );
});

it('calculates totals with tax correctly', function () {
    $items = [
        ['quantity' => 2, 'unit_price_cents' => 5000],
        ['quantity' => 1, 'unit_price_cents' => 10000],
    ];

    $totals = $this->service->calculateTotals($items, 19.0);

    expect($totals['subtotal'])->toBe(20000)
        ->and($totals['tax'])->toBe(3800)
        ->and($totals['total'])->toBe(23800);
});

it('calculates totals with zero tax rate', function () {
    $items = [['quantity' => 1, 'unit_price_cents' => 10000]];

    $totals = $this->service->calculateTotals($items, 0.0);

    expect($totals['subtotal'])->toBe(10000)
        ->and($totals['tax'])->toBe(0)
        ->and($totals['total'])->toBe(10000);
});

it('returns zero totals for empty items', function () {
    $totals = $this->service->calculateTotals([], 19.0);

    expect($totals['subtotal'])->toBe(0)
        ->and($totals['tax'])->toBe(0)
        ->and($totals['total'])->toBe(0);
});

it('rounds fractional quantities correctly', function () {
    $items = [['quantity' => 1.5, 'unit_price_cents' => 3333]];

    $totals = $this->service->calculateTotals($items, 0.0);

    // 1.5 × 3333 = 4999.5 → rounded to 5000
    expect($totals['subtotal'])->toBe(5000);
});
