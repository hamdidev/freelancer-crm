@component('mail::message')
    # Hello, {{ $client->name }}

    You've been invited to view your documents in the client portal.

    This link is valid for **24 hours** and can only be used once.

    @component('mail::button', ['url' => $portalUrl])
        Open My Portal
    @endcomponent

    If you did not request this, you can safely ignore this email.

    Thanks,
    {{ config('app.name') }}
@endcomponent
