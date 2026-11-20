import React, { useState } from 'react';
import {
  Star,
  ShoppingBag,
  Zap,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Share2,
  Clock
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onInstantBuy: (product: Product, quantity: number, size?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onInstantBuy,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.size);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'howToUse' | 'claims' | 'reviews'>('ingredients');
  const [isCopied, setIsCopied] = useState(false);

  // If this is the cream, show variant switcher for 80g vs 35g
  const isCream = product.category === 'Creams';
  const otherCreamVariant = isCream
    ? allProducts.find((p) => p.category === 'Creams' && p.id !== product.id)
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    onInstantBuy(product, quantity, selectedSize);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on PIRSAPAAAD Official Store!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi PIRSAPAAAD Team! I want to order ${quantity}x ${product.name} (${selectedSize}) priced at ₹${product.price * quantity}. Please confirm my order details!`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      {/* Breadcrumb & Back button */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-gray-300 hover:text-brand-yellow font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-brand-charcoal hover:bg-brand-gray text-gray-300 transition-colors flex items-center space-x-1"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isCopied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Display Image */}
          <div className="relative aspect-square rounded-3xl bg-white overflow-hidden border border-brand-gray/40 shadow-2xl flex items-center justify-center p-4">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.tag && (
                <span className="bg-brand-black text-brand-yellow font-black text-xs px-3 py-1 rounded-lg uppercase tracking-wider shadow-md border border-brand-yellow/30">
                  {product.tag}
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-lg shadow-md">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {product.badge && (
              <div className="absolute top-4 right-4">
                <span className="bg-brand-yellow text-black font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                  {product.badge}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden p-1 bg-white border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-brand-yellow shadow-glow-sm scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}

          {/* Guarantee Strip */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="bg-brand-charcoal/60 p-3 rounded-2xl border border-brand-gray/50">
              <ShieldCheck className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
              <span className="text-[11px] font-bold text-gray-200 block">100% Authentic</span>
              <span className="text-[9px] text-gray-400">Direct From Brand</span>
            </div>
            <div className="bg-brand-charcoal/60 p-3 rounded-2xl border border-brand-gray/50">
              <Sparkles className="w-5 h-5 mx-auto text-brand-yellow mb-1" />
              <span className="text-[11px] font-bold text-gray-200 block">7-Day Challenge</span>
              <span className="text-[9px] text-gray-400">Visible Radiance</span>
            </div>
            <div className="bg-brand-charcoal/60 p-3 rounded-2xl border border-brand-gray/50">
              <Truck className="w-5 h-5 mx-auto text-blue-400 mb-1" />
              <span className="text-[11px] font-bold text-gray-200 block">Fast All-India</span>
              <span className="text-[9px] text-gray-400">2-4 Days Delivery</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs text-brand-yellow font-bold uppercase tracking-wider mb-2">
              <span>{product.category}</span>
              <span>•</span>
              <span>Unisex Formulation</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-brand-yellow/90 font-semibold mt-1">
              {product.headline}
            </p>

            {/* Ratings Bar */}
            <div className="flex items-center space-x-3 mt-3">
              <div className="flex items-center space-x-1 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-extrabold text-sm text-amber-400">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-400">
                Based on <strong>{product.reviewCount.toLocaleString()}</strong> verified buyer ratings
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-brand-charcoal/80 p-5 rounded-2xl border border-brand-gray/60 space-y-2">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl sm:text-4xl font-black text-white">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md">
                    Save ₹{product.originalPrice - product.price} ({product.discount}%)
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-gray-400">
              Inclusive of all taxes. Free express shipping on all orders ₹499 and above.
            </p>
          </div>

          {/* Size Variant Selector (for Cream 80g vs 35g) */}
          {isCream && otherCreamVariant && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 block">
                Select Size Option:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedSize(product.size);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedSize === product.size
                      ? 'border-brand-yellow bg-brand-yellow/10 text-white'
                      : 'border-brand-gray/60 bg-brand-charcoal text-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-sm text-brand-yellow">{product.size}</span>
                    <span className="text-xs font-bold text-white">₹{product.price}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    {product.size === '80g' ? 'Best Value (2.5x More)' : 'Standard Jar'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    onSelectProduct(otherCreamVariant);
                  }}
                  className="p-3 rounded-xl border border-brand-gray/60 bg-brand-charcoal text-gray-400 text-left hover:border-gray-500 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-sm text-gray-300">{otherCreamVariant.size}</span>
                    <span className="text-xs font-bold text-gray-300">₹{otherCreamVariant.price}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-0.5">
                    Switch to {otherCreamVariant.size}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-gray-300">Quantity:</span>
              <div className="flex items-center space-x-2 bg-brand-charcoal border border-brand-gray/80 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-brand-gray text-white font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center font-extrabold text-sm text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-brand-gray text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Main Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-brand-charcoal hover:bg-brand-gray text-white border-2 border-brand-yellow font-extrabold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md"
              >
                <ShoppingBag className="w-4 h-4 text-brand-yellow" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-brand-yellow hover:bg-brand-yellow-dark text-black font-black py-3.5 px-6 rounded-xl transition-all shadow-glow-yellow flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Buy Now (₹{product.price * quantity})</span>
              </button>
            </div>

            {/* WhatsApp Direct Order Button */}
            <a
              href={`https://wa.me/917034044664?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Order Instantly on WhatsApp</span>
            </a>
          </div>

          {/* Key Product Highlights Bullet Points */}
          <div className="border-t border-brand-gray/60 pt-4 space-y-2">
            <h4 className="text-xs font-black uppercase text-brand-yellow tracking-wider">
              Key Highlights:
            </h4>
            <div className="space-y-1.5">
              {product.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accordion / Tabbed Information Sections */}
      <div className="bg-brand-charcoal/50 rounded-3xl p-6 sm:p-8 border border-brand-gray/60">
        {/* Tabs Bar */}
        <div className="flex items-center space-x-2 border-b border-brand-gray/60 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-colors ${
              activeTab === 'ingredients'
                ? 'bg-brand-yellow text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Verified Ingredients
          </button>

          <button
            onClick={() => setActiveTab('howToUse')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-colors ${
              activeTab === 'howToUse'
                ? 'bg-brand-yellow text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            How to Use
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-colors ${
              activeTab === 'claims'
                ? 'bg-brand-yellow text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Certified Claims
          </button>
        </div>

        {/* Tab Contents */}
        <div className="pt-6">
          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                PIRSAPAAAD uses only clinical-grade, laboratory-tested active ingredients formulated for high bioavailability without toxic fillers:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center space-x-2 bg-brand-black p-3 rounded-xl border border-brand-gray/70">
                    <Sparkles className="w-4 h-4 text-brand-yellow shrink-0" />
                    <span className="text-xs font-semibold text-gray-200">{ing}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'howToUse' && (
            <div className="space-y-4">
              <div className="bg-brand-black p-5 rounded-2xl border border-brand-gray/70 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-brand-yellow" />
                  <span>Step-by-Step Application Guide</span>
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                  {product.howToUse}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'claims' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.claims.map((claim, i) => (
                  <div key={i} className="flex items-center space-x-2 bg-brand-black p-3.5 rounded-xl border border-brand-gray/70">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-gray-200">{claim}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
