<?php

use App\Services\ProposalService;

beforeEach(function () {
    $this->service = new ProposalService;
});

it('returns zero total for empty content', function () {
    expect($this->service->calculateTotal([]))->toBe(0);
});

it('calculates total from a single pricing_item block', function () {
    $content = [
        [
            'type' => 'pricing_item',
            'attrs' => ['quantity' => 2, 'unit_price_cents' => 5000],
        ],
    ];

    expect($this->service->calculateTotal($content))->toBe(10000);
});

it('sums multiple pricing_item blocks', function () {
    $content = [
        ['type' => 'pricing_item', 'attrs' => ['quantity' => 1, 'unit_price_cents' => 10000]],
        ['type' => 'pricing_item', 'attrs' => ['quantity' => 3, 'unit_price_cents' => 2000]],
    ];

    expect($this->service->calculateTotal($content))->toBe(16000);
});

it('ignores non-pricing_item blocks', function () {
    $content = [
        ['type' => 'heading', 'attrs' => ['text' => 'Project Overview']],
        ['type' => 'paragraph', 'attrs' => ['text' => 'Some description']],
        ['type' => 'pricing_item', 'attrs' => ['quantity' => 1, 'unit_price_cents' => 5000]],
    ];

    expect($this->service->calculateTotal($content))->toBe(5000);
});

it('treats missing quantity or price as zero', function () {
    $content = [
        ['type' => 'pricing_item', 'attrs' => []],
    ];

    expect($this->service->calculateTotal($content))->toBe(0);
});
