<?php
// app/Http/Middleware/TrackPageView.php

namespace App\Http\Middleware;

use App\Models\VisitorEvent;
use App\Services\VisitorTracker;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackPageView
{
    public function __construct(private VisitorTracker $tracker)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($request->isMethod('get') && $this->tracker->shouldTrack($request)) {
            $visitorId = $this->tracker->visitorId($request);

            $this->tracker->log($request, VisitorEvent::TYPE_PAGE_VIEW);

            if (!$request->cookie(VisitorTracker::COOKIE)) {
                $response->headers->setCookie(
                    cookie(VisitorTracker::COOKIE, $visitorId, VisitorTracker::COOKIE_MINUTES)
                );
            }
        }

        return $response;
    }
}