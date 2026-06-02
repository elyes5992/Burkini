import React from 'react';

export default function WhatsAppButton() {
    // WhatsApp API requires the number without '+', spaces, or dashes
    const phoneNumber = "21695940668"; 
    
    // The WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    return (
        <a 
            href={whatsappUrl}
            target="_blank" 
            rel="noopener noreferrer"
            // Tailwind classes to fix it to the bottom right corner
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#25D366] text-white p-3.5 rounded-full shadow-lg shadow-[#25d366]/30 hover:bg-[#1EBE55] hover:-translate-y-1 transition-all duration-300 z-[100] flex items-center justify-center group"
            aria-label="Contact us on WhatsApp"
        >
            {/* Tooltip that shows ALL THE TIME now */}
            <span className="absolute right-[4.5rem] bg-white text-charcoal text-[11px] md:text-xs font-bold px-3 py-2 rounded-lg shadow-md pointer-events-none whitespace-nowrap">
                Discuter par message
            </span>

            {/* WhatsApp Icon */}
            <svg 
                viewBox="0 0 32 32" 
                className="w-7 h-7 md:w-8 md:h-8" 
                fill="currentColor" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M16.05 32h-.05c-2.65 0-5.25-.7-7.55-2.05L0 32l2.1-8.25A15.9 15.9 0 0 1 0 16C0 7.2 7.2 0 16 0s16 7.2 16 16-7.2 16-16 16zm-7.6-5.45l.4.25c2.15 1.3 4.6 1.95 7.15 1.95 7.8 0 14.15-6.35 14.15-14.15S23.8 1.85 16 1.85 1.85 8.2 1.85 16c0 2.65.7 5.15 2.05 7.35l.25.4-1.25 4.9 5.05-1.3z" />
                <path d="M23.6 20.3c-.4-.2-2.35-1.15-2.7-1.3-.35-.15-.6-.2-.85.2s-1 1.3-1.25 1.55c-.25.25-.5.3-.9.1-1.35-.65-2.6-1.5-3.6-2.55-1.05-1-1.95-2.25-2.65-3.6-.2-.4.05-.6.25-.8l.6-.7c.2-.2.25-.35.35-.6.1-.25.05-.5-.05-.7-.1-.2-.85-2.1-1.15-2.85-.3-.75-.6-.65-.85-.65h-.7c-.3 0-.75.1-1.15.55-.4.45-1.55 1.5-1.55 3.7 0 2.2 1.6 4.3 1.8 4.6.2.25 3.1 4.75 7.5 6.65.95.4 1.7.65 2.3.85 1 .3 1.9.25 2.6.15.8-.1 2.35-.95 2.7-1.9.35-.95.35-1.75.25-1.9-.15-.2-.4-.25-.8-.45z" />
            </svg>
        </a>
    );
}