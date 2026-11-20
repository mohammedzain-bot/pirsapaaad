import React from 'react';
import { Star, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Award, Zap, Heart, ChevronRight, Clock, Users, Phone } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { InstagramIcon } from '../components/Icons';

interface HomePageProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  setCurrentTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onOpenDetail,
  onInstantBuy,
  setCurrentTab,
}) => {
  const featuredProducts = products.filter((p) => p.isFeatured || p.isBestSeller);
  const bestSellers = products.filter((p) => p.isBestSeller);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION WITH IMAGE IN A STYLISH BOX */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-charcoal via-brand-black to-brand-black border-b border-brand-gray/60 py-6 sm:py-12">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-yellow/15 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-6">
          {/* Top Trust Header */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-brand-yellow/15 border border-brand-yellow/50 rounded-full px-4 py-1.5 shadow-glow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-yellow animate-ping" />
              <span className="text-xs sm:text-sm font-black text-brand-yellow uppercase tracking-wider">
                Official PIRSAPAAAD Brand Store • Wholesale & Retail
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Your Beauty. <span className="text-brand-yellow">Your Confidence.</span> Your Identity.
            </h1>
          </div>

          {/* THE HERO IMAGE BOX (Fully Mobile-Responsive) */}
          <div className="relative max-w-4xl mx-auto">
            {/* Box frame with subtle yellow/gold edge glow */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-brand-yellow/70 shadow-[0_0_40px_rgba(255,230,0,0.28)] bg-black group transition-all duration-300 hover:border-brand-yellow">
              <img
                src="/images/pirsapaaad-hero-banner.jpg"
                alt="PIRSAPAAAD Whitening Beauty Cream Unisex - Official Advertisement"
                className="w-full h-auto object-contain block mx-auto"
                loading="eager"
              />

              {/* Verified Ribbon Overlay */}
              <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 bg-brand-black/90 backdrop-blur-md text-brand-yellow border border-brand-yellow/50 text-[10px] sm:text-xs font-black px-2.5 sm:px-3.5 py-1 rounded-full shadow-lg flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% UNISEX FORMULA</span>
              </div>
            </div>

            {/* Quick Action Contact Bar directly under the Hero Box */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs">
              <a
                href="https://wa.me/917034044664?text=Hi%20PIRSAPAAAD%20Team%2C%20I%20want%20to%20order%20products!"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-2.5 px-4 sm:px-6 rounded-xl shadow-lg transition-all flex items-center space-x-2"
              >
                <Phone className="w-4 h-4 fill-black" />
                <span>WhatsApp: 7034044664</span>
              </a>

              <a
                href="tel:7034044664"
                className="bg-brand-charcoal hover:bg-brand-gray text-white border border-brand-yellow/40 font-bold py-2.5 px-4 sm:px-5 rounded-xl transition-all flex items-center space-x-1.5"
              >
                <span>Call: 7034044664</span>
              </a>

              <div className="hidden sm:flex items-center space-x-1.5 bg-brand-black border border-brand-gray/80 text-gray-300 font-semibold px-4 py-2.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>All Over India Wholesale & Retail Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DISPLAY THE FOUR PRODUCTS DIRECTLY BELOW THE HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3 border-b border-brand-gray/50 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-brand-yellow text-xs font-black tracking-widest uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Product Collection</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Our 4 Signature Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Authentic formulations for men and women. Click any product for verified ingredients, full details, and fast checkout.
            </p>
          </div>

          <div className="text-xs text-gray-400 font-semibold flex items-center space-x-2">
            <span className="bg-brand-yellow text-black font-black px-2.5 py-1 rounded-md">
              4 PRODUCTS
            </span>
            <span>In Stock for Immediate Pan-India Dispatch</span>
          </div>
        </div>

        {/* 2-Column Mobile Grid, 4-Column Desktop Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetail={onOpenDetail}
              onInstantBuy={onInstantBuy}
            />
          ))}
        </div>
      </section>

      {/* 4. THE 7-DAY CHALLENGE SECTION */}
      <section className="bg-brand-charcoal border-y border-brand-gray/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="inline-block bg-brand-yellow text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Clinical Transformation
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              The PIRSAPAAAD 7-Day Challenge
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Experience visible change in skin clarity, tone uniformity, and natural glow within 7 consecutive days of daily morning and evening application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-brand-black p-6 rounded-2xl border border-brand-gray/80 space-y-3 relative overflow-hidden">
              <span className="text-3xl font-black text-brand-yellow/30 absolute top-4 right-4">01</span>
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow font-black text-lg">
                1-2
              </div>
              <h3 className="text-base font-bold text-white">Days 1 - 2: Deep Hydration & Prep</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Active niacinamide and hyaluronic acid penetrate epidermal layers, soothing inflammation and balancing moisture barriers without greasy residue.
              </p>
            </div>

            <div className="bg-brand-black p-6 rounded-2xl border border-brand-gray/80 space-y-3 relative overflow-hidden">
              <span className="text-3xl font-black text-brand-yellow/30 absolute top-4 right-4">02</span>
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow font-black text-lg">
                3-5
              </div>
              <h3 className="text-base font-bold text-white">Days 3 - 5: Melanin Regulation</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Glutathione and Kojic Acid Dipalmitate inhibit excess melanin production. Stubborn dark spots and sun tan begin to visibly fade.
              </p>
            </div>

            <div className="bg-brand-black p-6 rounded-2xl border border-brand-yellow/80 space-y-3 relative overflow-hidden">
              <span className="text-3xl font-black text-brand-yellow/30 absolute top-4 right-4">03</span>
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow font-black text-lg">
                6-7
              </div>
              <h3 className="text-base font-bold text-white">Days 6 - 7: Luminous Transformation</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Noticeable brightness, refined texture, and an illuminated even tone emerge. Your skin feels firmer, radiant, and authentically glowing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE PIRSAPAAAD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-brand-yellow text-xs font-black uppercase tracking-widest">
            Uncompromised Quality
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Why Choose PIRSAPAAAD?
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            We bridge the gap between dermatologist-grade potency and gentle daily care for both men and women.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-brand-charcoal/60 border border-brand-gray/60 p-6 rounded-2xl text-center space-y-3 hover:border-brand-yellow/40 transition-colors">
            <div className="w-12 h-12 mx-auto rounded-xl bg-brand-yellow text-black flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-white text-base">100% Unisex</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Scientifically engineered to balance oil production in men’s skin while delivering refined brightening for women.
            </p>
          </div>

          <div className="bg-brand-charcoal/60 border border-brand-gray/60 p-6 rounded-2xl text-center space-y-3 hover:border-brand-yellow/40 transition-colors">
            <div className="w-12 h-12 mx-auto rounded-xl bg-brand-yellow text-black flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-white text-base">Clinically Proven Actives</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Formulated with Glutathione, Niacinamide 5%, and Kojic Acid. No harmful bleaches or hydroquinone.
            </p>
          </div>

          <div className="bg-brand-charcoal/60 border border-brand-gray/60 p-6 rounded-2xl text-center space-y-3 hover:border-brand-yellow/40 transition-colors">
            <div className="w-12 h-12 mx-auto rounded-xl bg-brand-yellow text-black flex items-center justify-center shadow-md">
              <Award className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-white text-base">Zero Harsh Chemicals</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cruelty-free, paraben-free, sulfate-free, and alcohol-free. Safe for sensitive and acne-prone skin.
            </p>
          </div>

          <div className="bg-brand-charcoal/60 border border-brand-gray/60 p-6 rounded-2xl text-center space-y-3 hover:border-brand-yellow/40 transition-colors">
            <div className="w-12 h-12 mx-auto rounded-xl bg-brand-yellow text-black flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-white text-base">Fast Pan-India Delivery</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Dispatched within 24 hours. Free express shipping on ₹499+ orders with real-time SMS & WhatsApp tracking.
            </p>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-charcoal/40 rounded-3xl p-6 sm:p-10 border border-brand-gray/60">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <div className="flex justify-center text-brand-yellow space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-brand-yellow" />
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Loved by 80,450+ Happy Customers
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Real reviews from verified buyers across Delhi, Mumbai, Bengaluru, Kashmir, and across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-brand-black p-5 rounded-2xl border border-brand-gray/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Buyer</span>
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed italic">
                “I bought the 80g jar after seeing the 7-day challenge on Instagram. Honestly, by day 5 my dark sunspots and forehead tanning had faded tremendously. Works so well for men too!”
              </p>
              <div className="border-t border-brand-gray/50 pt-2 flex items-center justify-between text-xs">
                <span className="font-bold text-white">Rahul Verma</span>
                <span className="text-gray-500 text-[11px]">Delhi • 80g Cream</span>
              </div>
            </div>

            <div className="bg-brand-black p-5 rounded-2xl border border-brand-gray/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Buyer</span>
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed italic">
                “Non-sticky, lightweight, and doesn’t leave a white chalky cast. The natural glow on my face is so evident. Also ordered the Roll-on perfume for ₹99, smells luxurious and lasts all day!”
              </p>
              <div className="border-t border-brand-gray/50 pt-2 flex items-center justify-between text-xs">
                <span className="font-bold text-white">Ananya Sen</span>
                <span className="text-gray-500 text-[11px]">Kolkata • 35g Jar & Attar</span>
              </div>
            </div>

            <div className="bg-brand-black p-5 rounded-2xl border border-brand-gray/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Buyer</span>
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed italic">
                “The lip balm + whitening cream combo is a holy grail. Lip pigmentation cleared up in a week. Packaging is so premium with the yellow and black jar. Definitely ordering again.”
              </p>
              <div className="border-t border-brand-gray/50 pt-2 flex items-center justify-between text-xs">
                <span className="font-bold text-white">Sameer Khan</span>
                <span className="text-gray-500 text-[11px]">Mumbai • Lip Balm & Cream</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INSTAGRAM SOCIAL FEED SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center space-x-1.5 text-brand-yellow font-bold text-xs uppercase tracking-wider">
            <InstagramIcon className="w-4 h-4" />
            <span>Join Our Beauty Community</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            @pirsapaaad_cream_unisex
          </h2>
          <p className="text-xs text-gray-400">
            Tag us in your #PIRSAPAAAD 7-Day transformation photos for a chance to get featured and win free gifts!
          </p>
        </div>

        {/* Instagram Visual Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-brand-gray/60">
            <img
              src="/images/cream-80g-studio.jpg"
              alt="PIRSAPAAAD Community"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <InstagramIcon className="w-6 h-6 text-brand-yellow" />
            </div>
          </div>

          <div className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-brand-gray/60">
            <img
              src="/images/product-cream-80g-authentic.png"
              alt="PIRSAPAAAD Packaging"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-amber-400"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <InstagramIcon className="w-6 h-6 text-brand-yellow" />
            </div>
          </div>

          <div className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-brand-gray/60">
            <img
              src="/images/pirsapaaad-perfume-official.jpg"
              alt="PIRSAPAAAD Desire Attar"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 bg-white"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <InstagramIcon className="w-6 h-6 text-brand-yellow" />
            </div>
          </div>

          <div className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-brand-gray/60">
            <img
              src="/images/pirsapaaad-lipbalm-official.jpg"
              alt="PIRSAPAAAD Lip Care"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 bg-white"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <InstagramIcon className="w-6 h-6 text-brand-yellow" />
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href="https://instagram.com/pirsapaaad_cream_unisex"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs py-2.5 px-6 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow on Instagram</span>
          </a>
        </div>
      </section>

      {/* 8. NEWSLETTER / VIP CLUB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-black border border-brand-yellow/30 p-8 sm:p-12 rounded-3xl text-center space-y-4 relative overflow-hidden">
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-brand-yellow text-xs font-black uppercase tracking-wider">
              Exclusive VIP Perks
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Get 10% OFF Your First Order
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Use code <strong className="text-brand-yellow font-extrabold">GLOW10</strong> at checkout for an instant discount on all PIRSAPAAAD products.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCurrentTab('shop')}
              className="bg-brand-yellow hover:bg-brand-yellow-dark text-black font-extrabold text-sm py-3 px-8 rounded-xl transition-all shadow-glow-yellow"
            >
              Claim Discount & Shop
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
