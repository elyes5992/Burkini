import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                adm: {
                    bg: '#0e0f13',
                    side: '#0a0b0e',
                    panel: '#14161c',
                    raise: '#1a1d25',
                    line: '#23262f',
                    'line-2': '#2e323d',
                    text: '#ececef',
                    muted: '#8b8f9c',
                    faint: '#5c606c',
                    accent: '#d9a441',
                    'accent-soft': 'rgba(217, 164, 65, 0.12)',
                    ok: '#10b981',
                    'ok-soft': 'rgba(16, 185, 129, 0.12)',
                    bad: '#ef4444',
                    'bad-soft': 'rgba(239, 68, 68, 0.12)',
                },
            },
        },
    },

    plugins: [forms],
};