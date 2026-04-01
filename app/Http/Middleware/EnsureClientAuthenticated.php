<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureClientAuthenticated
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! auth('client')->check()) {
            // Store intended URL for post-auth redirect
            session(['portal.intended' => $request->url()]);

            return redirect()->route('portal.session-expired');
        }

        return $next($request);
    }
}
