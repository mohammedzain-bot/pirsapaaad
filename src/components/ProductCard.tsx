import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Zap, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail, onInstantBuy }) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInstantBuy(product);
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group relative bg-white text-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
        {product.tag && (
          <span className="bg-brand-black text-brand-yellow text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-md tracking-wider uppercase shadow-sm border border-brand-yellow/30">
            {product.tag}
          </span>
        )}
        {product.discount > 0 && (
          <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {product.badge && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="bg-brand-yellow text-black text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
            {product.badge}
          </span>
        </div>
      )}

      {/* Image Container with Smooth Hover Swap */}
      <div
        className="relative w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-2"
        onMouseEnter={() => {
          if (product.images.length > 1) setCurrentImageIndex(1);
        }}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Pill */}
        <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="bg-black/80 backdrop-blur-sm text-white text-xs font-semibold py-1.5 px-3 rounded-full flex items-center space-x-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider">
              {product.category} • {product.size}
            </span>
            <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400 text-[10px]">({(product.reviewCount / 1000).toFixed(1)}k)</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-extrabold text-sm sm:text-base text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Short tagline */}
          <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-baseline space-x-2 mb-2.5">
            <span className="text-lg sm:text-xl font-extrabold text-gray-900">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 border ${
                isAdded
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-200'
              }`}
            >
              {isAdded ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-brand-yellow hover:bg-brand-yellow-dark text-black py-2 px-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1 shadow-sm hover:shadow-md"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
