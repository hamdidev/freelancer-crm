<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $proposal->title }}</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
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
            background: {{ $proposal->user->brand_color ?? '#1A4F8B' }};
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

        .proposal-card {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
        }

        .proposal-title {
            font-size: 16px;
            font-weight: 700;
            color: #0F172A;
            margin-bottom: 8px;
        }

        .proposal-meta {
            font-size: 12px;
            color: #475569;
            display: flex;
            justify-content: space-between;
        }

        .total {
            font-size: 24px;
            font-weight: 800;
            color: {{ $proposal->user->brand_color ?? '#1A4F8B' }};
            margin-top: 8px;
        }

        .btn {
            display: inline-block;
            padding: 14px 32px;
            background: {{ $proposal->user->brand_color ?? '#1A4F8B' }};
            color: #fff;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 12px;
        }

        .btn-outline {
            display: inline-block;
            padding: 14px 32px;
            border: 2px solid #E2E8F0;
            color: #475569;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 14px;
            margin-left: 12px;
        }

        .footer {
            padding: 24px 48px;
            background: #F8FAFC;
            border-top: 1px solid #E2E8F0;
            font-size: 11px;
            color: #94A3B8;
            text-align: center;
        }

        .divider {
            height: 1px;
            background: #E2E8F0;
            margin: 24px 0;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <!-- Header -->
        <div class="header">
            <h1>{{ $proposal->user->company_name ?? $proposal->user->name }}</h1>
            <p>Proposal for {{ $proposal->client->company_name ?? $proposal->client->contact_name }}</p>
        </div>

        <!-- Body -->
        <div class="body">
            <p class="greeting">
                Hello {{ $proposal->client->contact_name }},
            </p>

            <p class="text">
                {{ $proposal->user->name }} has sent you a proposal for review.
                Please take a moment to review the details and let us know your decision.
            </p>

            <!-- Proposal Card -->
            <div class="proposal-card">
                <div class="proposal-title">{{ $proposal->title }}</div>
                <div class="proposal-meta">
                    @if ($proposal->valid_until)
                        <span>Valid until {{ $proposal->valid_until->format('d.m.Y') }}</span>
                    @endif
                    <span>Prepared by {{ $proposal->user->name }}</span>
                </div>
                <div class="total">
                    € {{ number_format($proposal->total_cents / 100, 2, ',', '.') }}
                </div>
            </div>

            <div class="divider"></div>

            <!-- CTA buttons -->
            <p class="text">Click the button below to view the full proposal, review all details, and accept or
                decline:</p>

            <a href="{{ url('/p/' . $proposal->token) }}" class="btn">
                View Proposal →
            </a>

            <div class="divider"></div>

            <p class="text" style="font-size: 12px; color: #94A3B8;">
                If you have any questions, reply directly to this email or contact
                {{ $proposal->user->name }} at
                <a href="mailto:{{ $proposal->user->email }}"
                    style="color: {{ $proposal->user->brand_color ?? '#1A4F8B' }}">
                    {{ $proposal->user->email }}
                </a>.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                {{ $proposal->user->company_name ?? $proposal->user->name }} •
                {{ $proposal->user->address ?? '' }}
                {{ $proposal->user->city ?? '' }},
                {{ $proposal->user->country ?? 'DE' }}
            </p>
            @if ($proposal->user->steuernummer)
                <p>Steuernummer: {{ $proposal->user->steuernummer }}</p>
            @endif
            <p style="margin-top: 8px;">Powered by FreelancerCRM</p>
        </div>
    </div>
</body>

</html>
