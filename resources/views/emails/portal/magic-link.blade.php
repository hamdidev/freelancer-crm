<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Client Portal Access</title>
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
            background: #1A4F8B;
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

        .notice {
            font-size: 12px;
            color: #94A3B8;
            margin-top: 16px;
        }

        .divider {
            height: 1px;
            background: #E2E8F0;
            margin: 32px 0;
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
        <div class="header">
            <h1>Client Portal Access</h1>
            <p>Secure one-time login link</p>
        </div>

        <div class="body">
            <p class="greeting">Hello {{ $client->contact_name }},</p>

            <p class="text">
                You've been invited to access your client portal. Click the button below to log in.
                This link is valid for <strong>24 hours</strong> and can only be used once.
            </p>

            <a href="{{ $portalUrl }}" class="btn">Open My Portal →</a>

            <p class="notice">
                If you did not request this link, you can safely ignore this email.
            </p>

            <div class="divider"></div>

            <p class="text" style="font-size: 12px; color: #94A3B8;">
                If the button above doesn't work, copy and paste this URL into your browser:<br>
                <a href="{{ $portalUrl }}" style="color: #1A4F8B; word-break: break-all;">{{ $portalUrl }}</a>
            </p>
        </div>

        <div class="footer">
            <p>Powered by FreelancerCRM</p>
        </div>
    </div>
</body>

</html>
