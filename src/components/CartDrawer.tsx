import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    discount,
    couponCode,
    couponMessage,
    applyCoupon,
    removeCoupon,
    shipping,
    total
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 499;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = freeShippingThreshold - subtotal;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon) return;
    setLoadingCoupon(true);
    await applyCoupon(inputCoupon);
    setLoadingCoupon(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-charcoal border-l border-brand-gray/80 text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-gray/60 flex items-center justify-between bg-black/40">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-brand-yellow">Your Cart</span>
              <span className="text-xs bg-brand-yellow text-black font-extrabold px-2 py-0.5 rounded-full">
                {cart.length} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-brand-gray/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-brand-gray/40 px-5 py-3 border-b border-brand-gray/50">
            {subtotal >= freeShippingThreshold ? (
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                <Sparkles className="w-4 h-4 fill-emerald-400" />
                <span>You unlocked FREE Express All-India Shipping!</span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-300">
                  Add <strong className="text-brand-yellow">₹{amountNeeded}</strong> more for{' '}
                  <strong className="text-white">FREE Express Shipping</strong>
                </p>
                <div className="w-full bg-gray-700 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-brand-yellow h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-gray/40 flex items-center justify-center text-gray-500">
                  <Tag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Your Bag is Empty</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Discover the 7-day whitening cream & luxury perfumes
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-brand-yellow text-black font-bold text-xs py-2.5 px-6 rounded-xl hover:bg-brand-yellow-dark transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex space-x-3 bg-brand-black/60 p-3 rounded-2xl border border-brand-gray/60"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-brand-gray/40 bg-white/5"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-400 p-0.5 ml-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-gray-400 block font-medium">
                        Size: {item.selectedSize || item.product.size}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-1.5 bg-brand-gray/50 rounded-lg p-1 border border-brand-gray/70">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-sm text-brand-yellow">
                          ₹{item.product.price * item.quantity}
                        </span>
                        {item.product.originalPrice > item.product.price && (
                          <span className="text-[10px] text-gray-400 line-through block">
                            ₹{item.product.originalPrice * item.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-brand-gray/60 bg-black/60 space-y-3">
              {/* Promo code field */}
              {couponCode ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-xs">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{couponCode} (-₹{discount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-400 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon (e.g. GLOW10)"
                    className="flex-1 bg-brand-black border border-brand-gray/80 rounded-xl px-3 py-2 text-xs uppercase placeholder:normal-case focus:border-brand-yellow focus:outline-none text-white"
                  />
                  <button
                    type="submit"
                    disabled={loadingCoupon}
                    className="bg-brand-gray text-white hover:bg-brand-yellow hover:text-black font-bold text-xs px-4 rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMessage && !couponCode && (
                <p className="text-[11px] text-amber-400 font-medium">{couponMessage}</p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-300 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-white">
                    {shipping === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                <div className="border-t border-brand-gray/50 pt-2 flex justify-between text-base font-extrabold text-white">
                  <span>Total Amount</span>
                  <span className="text-brand-yellow text-lg">₹{total}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full bg-brand-yellow hover:bg-brand-yellow-dark text-black font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-glow-yellow flex items-center justify-center space-x-2 group"
              >
                <span>Proceed to WhatsApp Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant WhatsApp Order Confirmation • 100% Authentic</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
