<!DOCTYPE html>
<html lang="en">

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
            padding: 40px 48px;
            background: {{ $action === 'accepted' ? '#16a34a' : '#dc2626' }};
        }

        .header h1 {
            color: #fff;
            font-size: 20px;
            font-weight: 800;
            margin: 0;
        }

        .body {
            padding: 48px;
        }

        .text {
            font-size: 14px;
            line-height: 1.7;
            color: #475569;
            margin-bottom: 16px;
        }

        .note-box {
            background: #F8FAFC;
            border-left: 4px solid {{ $action === 'accepted' ? '#16a34a' : '#dc2626' }};
            padding: 16px 20px;
            border-radius: 0 8px 8px 0;
            font-size: 14px;
            color: #475569;
            margin: 24px 0;
            font-style: italic;
        }

        .btn {
            display: inline-block;
            padding: 14px 32px;
            background: #1A4F8B;
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
            <h1>
                @if ($action === 'accepted')
                    ✓ Proposal Accepted
                @else
                    ✗ Proposal Declined
                @endif
            </h1>
        </div>

        <div class="body">
            <p class="text">
                <strong>{{ $proposal->client->company_name ?? $proposal->client->contact_name }}</strong>
                has {{ $action }} your proposal:
                <strong>{{ $proposal->title }}</strong>.
            </p>

            @if ($proposal->client_note)
                <div class="note-box">
                    "{{ $proposal->client_note }}"
                    <br><small style="color: #94A3B8;">— {{ $proposal->client->contact_name }}</small>
                </div>
            @endif

            <p class="text">
                @if ($action === 'accepted')
                    Great news! You can now proceed with generating the contract.
                @else
                    Consider following up with the client to understand their concerns.
                @endif
            </p>

            <a href="{{ url('/proposals/' . $proposal->id . '/edit') }}" class="btn">
                View Proposal →
            </a>
        </div>

        <div class="footer">
            <p>FreelancerCRM — {{ now()->format('d.m.Y') }}</p>
        </div>
    </div>
</body>

</html>
