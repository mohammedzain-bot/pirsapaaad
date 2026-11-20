import React from 'react';
import { ShieldCheck, Truck, Clock, RefreshCw, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { InstagramIcon } from './Icons';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-black text-gray-300 border-t border-brand-gray/60 pt-14 pb-24 md:pb-14">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-brand-gray/40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-4 rounded-xl bg-brand-charcoal/40 border border-brand-gray/30">
            <div className="w-12 h-12 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">100% Authentic</h4>
            <p className="text-xs text-gray-400 mt-1">Direct from manufacturer with batch guarantee</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl bg-brand-charcoal/40 border border-brand-gray/30">
            <div className="w-12 h-12 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">7-Days Challenge</h4>
            <p className="text-xs text-gray-400 mt-1">Visible fairness & glowing radiance or return</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl bg-brand-charcoal/40 border border-brand-gray/30">
            <div className="w-12 h-12 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Express Shipping</h4>
            <p className="text-xs text-gray-400 mt-1">Free Delivery across India on ₹499+ orders</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl bg-brand-charcoal/40 border border-brand-gray/30">
            <div className="w-12 h-12 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">COD Available</h4>
            <p className="text-xs text-gray-400 mt-1">UPI, Credit/Debit Cards & Cash on Delivery</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-yellow p-0.5 border border-brand-yellow/60">
              <img src="/images/brand-logo.png" alt="PIRSAPAAAD" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-2xl tracking-wider text-brand-yellow">PIRSAPAAAD</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            PIRSAPAAAD is a premier unisex cosmetics & personal care house dedicated to high-performance active formulations. Engineered to elevate your natural skin radiance and confidence.
          </p>
          <div className="pt-2 flex items-center space-x-3">
            <a
              href="https://instagram.com/pirsapaaad_cream_unisex"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-brand-charcoal border border-brand-gray/60 flex items-center justify-center text-gray-300 hover:text-brand-yellow hover:border-brand-yellow transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/917034044664"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-brand-charcoal border border-brand-gray/60 flex items-center justify-center text-gray-300 hover:text-emerald-400 hover:border-emerald-400 transition-colors"
              aria-label="WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="font-bold text-sm text-brand-yellow uppercase tracking-wider mb-4">Shop Categories</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setCurrentTab('shop')} className="hover:text-brand-yellow transition-colors">
                All Products
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('shop-cream')} className="hover:text-brand-yellow transition-colors">
                Whitening Beauty Cream (80g & 35g)
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('shop-fragrance')} className="hover:text-brand-yellow transition-colors">
                Roll-On Perfume (Desire Attar)
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('shop-lip')} className="hover:text-brand-yellow transition-colors">
                Nourishing Lip Balm
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('challenge')} className="hover:text-brand-yellow transition-colors">
                The 7-Day Transformation Guide
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h5 className="font-bold text-sm text-brand-yellow uppercase tracking-wider mb-4">Customer Care</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setCurrentTab('track')} className="hover:text-brand-yellow transition-colors">
                Track Your Order
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('shipping')} className="hover:text-brand-yellow transition-colors">
                Shipping & Delivery Policy
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('faq')} className="hover:text-brand-yellow transition-colors">
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('admin')} className="text-gray-500 hover:text-brand-yellow transition-colors">
                Store Admin Portal
              </button>
            </li>
          </ul>
        </div>

        {/* Official Contact Info */}
        <div className="space-y-3">
          <h5 className="font-bold text-sm text-brand-yellow uppercase tracking-wider mb-4">Direct Contact</h5>
          <div className="flex items-start space-x-2 text-xs text-gray-400">
            <InstagramIcon className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
            <span>@pirsapaaad_cream_unisex</span>
          </div>
          <div className="flex items-start space-x-2 text-xs text-gray-400">
            <Phone className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
            <span>WhatsApp / Call: +91 7034044664</span>
          </div>
          <div className="flex items-start space-x-2 text-xs text-gray-400">
            <Mail className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
            <span>care@pirsapaaad.com</span>
          </div>
          <div className="flex items-start space-x-2 text-xs text-gray-400">
            <MapPin className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
            <span>Crafted & Formulated in India • Pan-India Delivery</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-brand-gray/30 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-3 sm:space-y-0">
        <div>
          © {new Date().getFullYear()} PIRSAPAAAD Unisex Cosmetics. All rights reserved.
        </div>
        <div className="flex items-center space-x-2">
          <span>Official Brand Store • Unisex Skin & Personal Care</span>
        </div>
      </div>
    </footer>
  );
};
