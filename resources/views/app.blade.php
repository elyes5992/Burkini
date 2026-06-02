<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('image/logo2.png') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead

    <!-- Meta Pixel -->
    <script>
        ! function(f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function() {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        fbq('init', '2452342321900510');
        fbq('track', 'PageView');

        window.trackMetaEvent = function(eventType, data) {
            // 1. Browser pixel (immediate)
            if (eventType === 'add-to-cart') { // ← was 'add_to_cart'
                fbq('track', 'AddToCart', {
                    content_ids: [String(data.product_id)],
                    content_type: 'product',
                    value: data.price * data.quantity,
                    currency: 'TND'
                });
            } else if (eventType === 'purchase') {
                fbq('track', 'Purchase', {
                    content_ids: data.items.map(i => String(i.id)),
                    content_type: 'product',
                    value: data.total,
                    currency: 'TND'
                });
            }

            // 2. Server-side Conversions API
            const endpoints = {
                'add-to-cart': '/api/meta/add-to-cart', // ← was 'add_to_cart'
                'purchase': '/api/meta/purchase',
            };
            const url = endpoints[eventType];
            if (!url) return;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                credentials: 'same-origin',
                body: JSON.stringify(data),
            }).catch(console.error);
        };
    </script>
    <noscript>
        <img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=2452342321900510&ev=PageView&noscript=1" />
    </noscript>
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>