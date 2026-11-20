import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const directLink = "https://wa.me/917034044664?text=Hi%20PIRSAPAAAD%20Team%2C%20I%20want%20to%20order%20the%20Whitening%20Beauty%20Cream%20and%20know%20more%20about%20the%207%20Days%20Challenge!";

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-6 z-40 flex flex-col items-end">
      {/* Tooltip Dialog */}
      {isOpen && (
        <div className="mb-3 bg-brand-charcoal text-white p-4 rounded-2xl shadow-2xl border border-brand-yellow/30 max-w-xs animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 border-b border-brand-gray/50 mb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-xs font-bold text-brand-yellow">PIRSAPAAAD VIP Support</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed mb-3">
            Have questions about the 7-day challenge or want to place your order directly via WhatsApp? Chat with our beauty advisor now!
          </p>
          <a
            href={directLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs py-2 px-3 rounded-xl transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat On WhatsApp</span>
          </a>
        </div>
      )}

      {/* Floating Button with pulsing badge */}
      <div className="relative group">
        <span className="absolute -inset-1 bg-emerald-500 rounded-full blur-md opacity-40 group-hover:opacity-80 transition duration-300 animate-pulse" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-emerald-500 hover:bg-emerald-400 text-black p-3.5 md:p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          aria-label="WhatsApp Support"
        >
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7 fill-black" />
          <span className="sr-only">WhatsApp Chat</span>
        </button>
      </div>
    </div>
  );
};
