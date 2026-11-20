import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ShieldCheck, Sparkles, Phone, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenProduct?: (productId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { label: 'Home', tab: 'home' },
    { label: 'Shop All', tab: 'shop' },
    { label: 'Whitening Cream', tab: 'shop-cream' },
    { label: '7-Day Challenge', tab: 'challenge' },
    { label: 'Track Order', tab: 'track' },
    { label: 'Admin', tab: 'admin' },
  ];

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-black/95 backdrop-blur-md border-b border-brand-gray/60 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-brand-yellow text-black text-xs md:text-sm font-bold py-1.5 px-4 text-center tracking-wide flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 fill-black animate-pulse" />
        <span>7-DAYS CHALLENGE SPECIAL: FREE ALL-INDIA SHIPPING ON ORDERS ₹499+ | CODE: <strong>GLOW10</strong></span>
        <Sparkles className="w-3.5 h-3.5 fill-black animate-pulse" />
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-brand-yellow focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2.5 text-left group focus:outline-none"
          >
            <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-lg overflow-hidden bg-brand-yellow p-0.5 border border-brand-yellow/80 shadow-glow-sm">
              <img
                src="/images/brand-logo.png"
                alt="PIRSAPAAAD Logo"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl md:text-2xl tracking-wider text-brand-yellow leading-none group-hover:text-white transition-colors">
                PIRSAPAAAD
              </span>
              <span className="text-[9px] md:text-[10px] text-gray-300 tracking-widest uppercase font-semibold">
                Whitening Beauty Cream Unisex
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => handleNavClick(item.tab)}
              className={`text-sm font-semibold tracking-wide transition-colors py-1 relative ${
                currentTab === item.tab
                  ? 'text-brand-yellow font-bold'
                  : 'text-gray-300 hover:text-brand-yellow'
              }`}
            >
              {item.label}
              {currentTab === item.tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-yellow rounded-full shadow-glow-sm" />
              )}
            </button>
          ))}
        </nav>

        {/* Right: Actions (WhatsApp, Cart Button) */}
        <div className="flex items-center space-x-3">
          <a
            href="https://wa.me/917034044664?text=Hi%20PIRSAPAAAD%20Team%2C%20I%20have%20an%20inquiry%20about%20your%20products"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-full hover:bg-emerald-600/30 transition-all"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Support</span>
          </a>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-brand-charcoal text-brand-yellow hover:bg-brand-yellow hover:text-black border border-brand-yellow/30 rounded-xl transition-all shadow-sm focus:outline-none flex items-center justify-center"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-yellow text-black font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-charcoal border-b border-brand-gray/80 px-4 pt-3 pb-5 space-y-3 shadow-2xl animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => handleNavClick(item.tab)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                currentTab === item.tab
                  ? 'bg-brand-yellow text-black font-bold'
                  : 'text-gray-200 hover:bg-brand-gray/50 hover:text-brand-yellow'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-brand-gray/50 flex flex-col space-y-2">
            <a
              href="https://wa.me/917034044664?text=Hi%20PIRSAPAAAD%20Team%2C%20I%20want%20to%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2.5 px-4 rounded-lg text-sm transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Direct WhatsApp: 7034044664</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
