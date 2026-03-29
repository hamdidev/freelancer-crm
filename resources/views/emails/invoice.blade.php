<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice {{ $invoice->number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #F8FAFC;
            margin: 0;
            padding: 0;
            color: #0F172A;
        }

        .wrapper {
            max-width: 600px;
            margin: 40px auto;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(26, 79, 139, 0.08);
        }

        .header {
            background: {{ $invoice->user->brand_color ?? '#1A4F8B' }};
            padding: 40px 48px;
        }

        .header h1 {
            color: #fff;
            font-size: 22px;
            font-weight: 800;
            margin: 0 0 4px;
        }

        .header p {
            color: rgba(255, 255, 255, 0.75);
            font-size: 13px;
            margin: 0;
        }

        .body {
            padding: 48px;
        }

        .greeting {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 16px;
        }

        .text {
            font-size: 14px;
            line-height: 1.7;
            color: #475569;
            margin-bottom: 24px;
        }

        .invoice-card {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
        }

        .invoice-number {
            font-size: 13px;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .invoice-meta {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #475569;
            margin-bottom: 16px;
        }

        .divider {
            height: 1px;
            background: #E2E8F0;
            margin: 16px 0;
        }

        .line-items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }

        .line-items th {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94A3B8;
            text-align: left;
            padding: 8px 0;
            border-bottom: 1px solid #E2E8F0;
        }

        .line-items td {
            font-size: 13px;
            color: #0F172A;
            padding: 10px 0;
            border-bottom: 1px solid #F1F5F9;
        }

        .line-items td.right {
            text-align: right;
        }

        .totals {
            width: 100%;
        }

        .totals td {
            font-size: 13px;
            padding: 4px 0;
            color: #475569;
        }

        .totals td.right {
            text-align: right;
        }

        .totals tr.total td {
            font-size: 16px;
            font-weight: 800;
            color: #0F172A;
            padding-top: 12px;
            border-top: 2px solid #E2E8F0;
        }

        .total-amount {
            font-size: 28px;
            font-weight: 800;
            color: {{ $invoice->user->brand_color ?? '#1A4F8B' }};
            margin: 16px 0 4px;
        }

        .btn {
            display: inline-block;
            padding: 14px 32px;
            background: {{ $invoice->user->brand_color ?? '#1A4F8B' }};
            color: #fff;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 14px;
        }

        .due-badge {
            display: inline-block;
            background: #FEF3C7;
            color: #92400E;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 24px;
        }

        .footer {
            padding: 24px 48px;
            background: #F8FAFC;
            border-top: 1px solid #E2E8F0;
            font-size: 11px;
            color: #94A3B8;
            text-align: center;
            line-height: 1.8;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <!-- Header -->
        <div class="header">
            <h1>{{ $invoice->user->company_name ?? $invoice->user->name }}</h1>
            <p>Invoice for {{ $invoice->client->company_name ?? $invoice->client->contact_name }}</p>
        </div>

        <!-- Body -->
        <div class="body">
            <p class="greeting">
                Hello {{ $invoice->client->contact_name }},
            </p>

            <p class="text">
                Please find your invoice from
                <strong>{{ $invoice->user->company_name ?? $invoice->user->name }}</strong>
                attached below. Kindly arrange payment before the due date.
            </p>

            <!-- Invoice Card -->
            <div class="invoice-card">
                <div class="invoice-number">{{ $invoice->number }}</div>

                <div class="invoice-meta">
                    <span>Issue Date: {{ $invoice->issue_date->format('d.m.Y') }}</span>
                    <span>Due Date: {{ $invoice->due_at->format('d.m.Y') }}</span>
                </div>

                @if ($invoice->service_date)
                    <div style="font-size: 12px; color: #475569; margin-bottom: 12px;">
                        Leistungsdatum: {{ $invoice->service_date->format('d.m.Y') }}
                    </div>
                @endif

                <div class="divider"></div>

                <!-- Line Items -->
                <table class="line-items">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th class="right">Qty</th>
                            <th class="right">Unit Price</th>
                            <th class="right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($invoice->items as $item)
                            <tr>
                                <td>{{ $item->description }}</td>
                                <td class="right">{{ $item->quantity }}</td>
                                <td class="right">€{{ number_format($item->unit_price_cents / 100, 2, ',', '.') }}
                                </td>
                                <td class="right">€{{ number_format($item->total_cents / 100, 2, ',', '.') }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

                <!-- Totals -->
                <table class="totals">
                    <tr>
                        <td>Subtotal</td>
                        <td class="right">€{{ number_format($invoice->subtotal_cents / 100, 2, ',', '.') }}</td>
                    </tr>
                    <tr>
                        <td>VAT ({{ $invoice->tax_rate }}%)</td>
                        <td class="right">€{{ number_format($invoice->tax_cents / 100, 2, ',', '.') }}</td>
                    </tr>
                    <tr class="total">
                        <td>Total Due</td>
                        <td class="right">€{{ number_format($invoice->total_cents / 100, 2, ',', '.') }}</td>
                    </tr>
                </table>
            </div>

            <div class="due-badge">
                Due by {{ $invoice->due_at->format('d.m.Y') }}
            </div>

            <p class="text">
                Click the button below to pay securely online:
            </p>

            <a href="{{ url('/portal/invoices/' . $invoice->id . '/pay') }}" class="btn">
                Pay Invoice →
            </a>

            <div class="divider" style="margin-top: 32px;"></div>

            @if ($invoice->notes)
                <p class="text" style="margin-top: 24px;">
                    <strong>Notes:</strong><br>
                    {{ $invoice->notes }}
                </p>
            @endif

            <p class="text" style="font-size: 12px; color: #94A3B8; margin-top: 24px;">
                Questions? Contact
                <a href="mailto:{{ $invoice->user->email }}"
                    style="color: {{ $invoice->user->brand_color ?? '#1A4F8B' }}">
                    {{ $invoice->user->email }}
                </a>
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                {{ $invoice->user->company_name ?? $invoice->user->name }}<br>
                @if ($invoice->user->address)
                    {{ $invoice->user->address }},
                @endif
                @if ($invoice->user->city)
                    {{ $invoice->user->city }}
                @endif
            </p>
            @if ($invoice->user->steuernummer)
                <p>Steuernummer: {{ $invoice->user->steuernummer }}</p>
            @endif
            @if ($invoice->user->ust_idnr)
                <p>USt-IdNr: {{ $invoice->user->ust_idnr }}</p>
            @endif
            <p style="margin-top: 8px;">Powered by FreelancerCRM</p>
        </div>
    </div>
</body>

</html>
