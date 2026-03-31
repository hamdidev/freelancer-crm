<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8" />
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
            background: {{ $contract->user->brand_color ?? '#1A4F8B' }};
            padding: 40px 48px;
        }

        .header h1 {
            color: #fff;
            font-size: 20px;
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

        .text {
            font-size: 14px;
            line-height: 1.7;
            color: #475569;
            margin-bottom: 24px;
        }

        .contract-card {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
        }

        .btn {
            display: inline-block;
            padding: 14px 32px;
            background: {{ $contract->user->brand_color ?? '#1A4F8B' }};
            color: #fff;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 14px;
        }

        .footer {
            padding: 24px 48px;
            background: #F8FAFC;
            border-top: 1px solid #E2E8F0;
            font-size: 11px;
            color: #94A3B8;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="header">
            <h1>{{ $contract->user->company_name ?? $contract->user->name }}</h1>
            <p>Contract for {{ $contract->client->company_name ?? $contract->client->contact_name }}</p>
        </div>
        <div class="body">
            <p class="text">Hello {{ $contract->client->contact_name }},</p>
            <p class="text">
                Please review and sign the contract below from
                <strong>{{ $contract->user->company_name ?? $contract->user->name }}</strong>.
            </p>
            <div class="contract-card">
                <p style="font-weight: 700; margin: 0 0 8px;">{{ $contract->title }}</p>
                <p style="font-size: 12px; color: #475569; margin: 0;">
                    Sent on {{ $contract->sent_at->format('d.m.Y') }}
                </p>
            </div>
            <a href="{{ url('/contracts/' . $contract->token . '/sign') }}" class="btn">
                Review & Sign Contract →
            </a>
            <p class="text" style="margin-top: 24px; font-size: 12px; color: #94A3B8;">
                Questions? Contact
                <a href="mailto:{{ $contract->user->email }}"
                    style="color: {{ $contract->user->brand_color ?? '#1A4F8B' }}">
                    {{ $contract->user->email }}
                </a>
            </p>
        </div>
        <div class="footer">
            <p>{{ $contract->user->company_name ?? $contract->user->name }}</p>
            @if ($contract->user->steuernummer)
                <p>Steuernummer: {{ $contract->user->steuernummer }}</p>
            @endif
        </div>
    </div>
</body>

</html>
