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
            background: #16a34a;
            padding: 40px 48px;
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

        .meta {
            background: #F8FAFC;
            border-radius: 12px;
            padding: 20px 24px;
            font-size: 13px;
            color: #475569;
            margin: 24px 0;
        }

        .meta p {
            margin: 4px 0;
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
            <h1>✓ Contract Signed</h1>
        </div>
        <div class="body">
            <p class="text">
                <strong>{{ $contract->client->company_name ?? $contract->client->contact_name }}</strong>
                has signed the contract: <strong>{{ $contract->title }}</strong>
            </p>
            <div class="meta">
                <p><strong>Signed at:</strong> {{ $contract->signed_at->format('d.m.Y H:i') }}</p>
                <p><strong>Signer IP:</strong> {{ $contract->signer_ip }}</p>
                <p><strong>Document hash:</strong> {{ substr($contract->document_hash, 0, 20) }}...</p>
            </div>
            <p class="text">
                This signature satisfies eIDAS Simple Electronic Signature requirements
                for commercial contracts in the EU.
            </p>
            <a href="{{ url('/contracts/' . $contract->id . '/edit') }}" class="btn">
                View Contract →
            </a>
        </div>
        <div class="footer">
            <p>FreelancerCRM — {{ now()->format('d.m.Y') }}</p>
        </div>
    </div>
</body>

</html>
