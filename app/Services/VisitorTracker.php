<?php
// app/Services/VisitorTracker.php

namespace App\Services;

use App\Models\VisitorEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VisitorTracker
{
    public const COOKIE = 'visitor_id';
    public const COOKIE_MINUTES = 60 * 24 * 365;

    public function visitorId(Request $request): string
    {
        $existing = $request->cookie(self::COOKIE);

        if ($existing) {
            return $existing;
        }

        $newId = (string) Str::uuid();
        cookie()->queue(self::COOKIE, $newId, self::COOKIE_MINUTES);

        return $newId;
    }

    public function log(Request $request, string $eventType, array $extra = []): VisitorEvent
    {
        $visitorId = $this->visitorId($request);

        $data = [
            'visitor_id'   => $visitorId,
            'user_id'      => auth()->id(),
            'session_id'   => $request->session()->getId(),
            'event_type'   => $eventType,
            'url'          => mb_substr($request->fullUrl(), 0, 500),
            'referrer'     => mb_substr((string) $request->headers->get('referer'), 0, 500),
            'utm_source'   => $request->query('utm_source'),
            'utm_medium'   => $request->query('utm_medium'),
            'utm_campaign' => $request->query('utm_campaign'),
            'ip_address'   => $request->ip(),
            'user_agent'   => mb_substr((string) $request->userAgent(), 0, 500),
            'platform'     => $this->detectPlatform($request->userAgent()),
        ];

        if (isset($extra['product_id'])) {
            $data['product_id'] = $extra['product_id'];
            unset($extra['product_id']);
        }
        if (isset($extra['product_type'])) {
            $data['product_type'] = $extra['product_type'];
            unset($extra['product_type']);
        }
        if (isset($extra['order_id'])) {
            $data['order_id'] = $extra['order_id'];
            unset($extra['order_id']);
        }

        if (!empty($extra)) {
            $data['meta'] = $extra;
        }

        return VisitorEvent::create($data);
    }

    private function detectPlatform(?string $userAgent): string
    {
        if (!$userAgent) return 'unknown';

        $ua = strtolower($userAgent);

        if (str_contains($ua, 'mobile') || (str_contains($ua, 'android') && !str_contains($ua, 'tablet'))) {
            return 'mobile';
        }
        if (str_contains($ua, 'tablet') || str_contains($ua, 'ipad')) {
            return 'tablet';
        }
        return 'desktop';
    }

    public function shouldTrack(Request $request): bool
    {
        if ($request->is('admin*', 'api/*', '_debugbar*', 'livewire/*', 'sanctum/*', 'storage/*')) {
            return false;
        }

        $agent = strtolower((string) $request->userAgent());

        foreach (['bot', 'spider', 'crawl', 'curl', 'facebookexternalhit', 'headless', 'monitor'] as $needle) {
            if (str_contains($agent, $needle)) {
                return false;
            }
        }

        return true;
    }
}