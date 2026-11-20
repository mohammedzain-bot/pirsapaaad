import React from 'react';
import { Home, Grid, ShoppingBag, Truck, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab }) => {
  const { cartCount, setIsCartOpen } = useCart();

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-black/95 backdrop-blur-lg border-t border-brand-gray/60 px-2 py-2">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-semibold transition-all ${
            currentTab === 'home' ? 'text-brand-yellow scale-105' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => handleNav('shop')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-semibold transition-all ${
            currentTab === 'shop' || currentTab === 'shop-cream' ? 'text-brand-yellow scale-105' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span>Shop</span>
        </button>

        {/* Floating Cart Button in Center */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative -mt-6 bg-brand-yellow text-black p-3.5 rounded-full shadow-glow-yellow border-2 border-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          aria-label="Open Cart"
        >
          <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-brand-yellow font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-brand-yellow">
              {cartCount}
            </span>
          )}
        </button>

        {/* Track Order */}
        <button
          onClick={() => handleNav('track')}
          className={`flex flex-col items-center py-1 px-2 text-xs font-semibold transition-all ${
            currentTab === 'track' ? 'text-brand-yellow scale-105' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Truck className="w-5 h-5 mb-0.5" />
          <span>Track</span>
        </button>

        {/* WhatsApp Quick Order */}
        <a
          href="https://wa.me/917034044664?text=Hi%20PIRSAPAAAD%20Team%2C%20I%20want%20to%20order%20products"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center py-1 px-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-all"
        >
          <MessageCircle className="w-5 h-5 mb-0.5 fill-emerald-500/20" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
