import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, MessageCircle, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Customer, Order } from '../types';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onOrderSuccess }) => {
  const { cart, subtotal, discount, shipping, total, clearCart } = useCart();

  const [customer, setCustomer] = useState<Customer>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    orderNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Auto-fetch city/state on 6-digit Indian PIN code
  const handlePincodeChange = async (pin: string) => {
    setCustomer(prev => ({ ...prev, pincode: pin }));
    if (pin.length === 6 && /^\d+$/.test(pin)) {
      setPincodeLoading(true);
      try {
        const res = await fetch(`/api/pincode/${pin}`);
        const data = await res.json();
        if (data.city && data.state) {
          setCustomer(prev => ({
            ...prev,
            city: data.city,
            state: data.state
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customer.fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!customer.phone.trim() || customer.phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp mobile number');
      return;
    }
    if (!customer.address.trim()) {
      setErrorMsg('Please enter your delivery address');
      return;
    }
    if (!customer.pincode.trim() || customer.pincode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit PIN code');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer,
        items: cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          size: item.selectedSize || item.product.size,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0]
        })),
        subtotal,
        discount,
        shipping,
        total,
        paymentMethod: 'WhatsApp Order',
        paymentStatus: 'WhatsApp Confirmation'
      };

      let savedOrder: Order | null = null;

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
        const data = await res.json();
        if (data.success && data.order) {
          savedOrder = data.order;
        }
      } catch (err) {
        console.warn('Backend order recording fallback:', err);
      }

      if (!savedOrder) {
        savedOrder = {
          id: 'PSP-' + Date.now().toString().slice(-6),
          ...orderPayload,
          createdAt: new Date().toISOString()
        } as Order;
      }

      // Build structured WhatsApp message for +91 7034044664
      const orderItemsText = cart
        .map(
          (item, idx) =>
            `${idx + 1}. *${item.product.name}* (${item.selectedSize || item.product.size})\n   Qty: ${item.quantity} | Price: ₹${item.product.price * item.quantity}`
        )
        .join('\n');

      const whatsappText = `🛍️ *NEW ORDER - PIRSAPAAAD* 🛍️\n` +
        `Order ID: #${savedOrder.id}\n` +
        `-----------------------------------------\n` +
        `👤 *Customer Name:* ${customer.fullName}\n` +
        `📱 *WhatsApp Phone:* ${customer.phone}\n` +
        `📍 *Delivery Address:*\n${customer.address}\n` +
        `${customer.city ? customer.city + ', ' : ''}${customer.state ? customer.state + ' - ' : ''}${customer.pincode}\n` +
        (customer.orderNotes ? `📝 *Notes:* ${customer.orderNotes}\n` : '') +
        `-----------------------------------------\n` +
        `📦 *Ordered Items:*\n${orderItemsText}\n` +
        `-----------------------------------------\n` +
        `💰 *Total Amount:* ₹${total} (FREE Express Delivery)\n` +
        `Payment Method: WhatsApp Order\n\n` +
        `Please confirm my order and share dispatch tracking details!`;

      // Open WhatsApp chat directly
      const waUrl = `https://wa.me/917034044664?text=${encodeURIComponent(whatsappText)}`;
      window.open(waUrl, '_blank');

      clearCart();
      onOrderSuccess(savedOrder);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
        <button
          onClick={onBack}
          className="bg-brand-yellow text-black font-bold text-xs py-2 px-6 rounded-xl hover:bg-brand-yellow-dark"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-brand-yellow font-bold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customer Info Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Delivery Details */}
            <div className="bg-brand-charcoal p-5 sm:p-6 rounded-2xl border border-brand-gray/60 space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-brand-gray/50">
                <span className="w-6 h-6 rounded-full bg-brand-yellow text-black font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base font-bold text-white">Delivery Details</h3>
              </div>

              {errorMsg && (
                <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full bg-brand-black border border-brand-gray/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">WhatsApp Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit WhatsApp number"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-brand-black border border-brand-gray/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-brand-black border border-brand-gray/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Delivery Street Address & House No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="House/Flat No., Building name, Street, Landmark"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-brand-black border border-brand-gray/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">PIN Code *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="6-digit PIN"
                      value={customer.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className="w-full bg-brand-black border border-brand-gray/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-yellow focus:outline-none"
                    />
                    {pincodeLoading && (
                      <span className="absolute right-3 top-2.5 text-[10px] text-brand-yellow animate-pulse">
                        Checking...
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">City / District</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full bg-brand-black border border-brand-gray/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-300">State</label>
                  <input
                    type="text"
                    placeholder="State"
                    value={customer.state}
                    onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                    className="w-full bg-brand-black border border-brand-gray/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Order Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Any specific delivery instructions or wholesale inquiry..."
                    value={customer.orderNotes}
                    onChange={(e) => setCustomer({ ...customer, orderNotes: e.target.value })}
                    className="w-full bg-brand-black border border-brand-gray/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-yellow focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Direct WhatsApp Ordering Notice */}
            <div className="bg-brand-charcoal p-5 sm:p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 to-brand-charcoal space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-brand-gray/50">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-black font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Direct WhatsApp Ordering</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                    OFFICIAL
                  </span>
                </h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Orders are handled directly with our team on WhatsApp (<strong className="text-emerald-400">+91 7034044664</strong>).
                Clicking below will format your order and open WhatsApp to confirm instantly with our dispatch team.
              </p>
              <div className="flex items-center space-x-4 pt-1 text-[11px] text-gray-400">
                <span className="flex items-center space-x-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Instant Response</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Genuine Brand Support</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Wholesale & Retail</span>
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-sm py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 group cursor-pointer disabled:opacity-50"
            >
              <MessageCircle className="w-5 h-5 fill-black group-hover:scale-110 transition-transform" />
              <span>
                {isSubmitting ? 'Preparing Order...' : `Complete Order on WhatsApp • ₹${total}`}
              </span>
            </button>
          </form>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-brand-charcoal p-5 sm:p-6 rounded-2xl border border-brand-gray/60 space-y-4">
            <h3 className="text-sm font-extrabold uppercase text-gray-300 tracking-wider pb-2 border-b border-brand-gray/50">
              Order Summary ({cart.length} items)
            </h3>

            {/* Items */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex items-center justify-between text-xs space-x-3 bg-brand-black/60 p-2.5 rounded-xl border border-brand-gray/40"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-contain bg-white p-0.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{item.product.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {item.selectedSize || item.product.size} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-extrabold text-brand-yellow shrink-0">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-brand-gray/50 pt-3 space-y-2 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold text-emerald-400">FREE Pan-India Express</span>
              </div>
              <div className="border-t border-brand-gray/50 pt-2 flex justify-between text-base font-black text-white">
                <span>Total Amount</span>
                <span className="text-brand-yellow text-xl">₹{total}</span>
              </div>
            </div>

            {/* Trust highlights */}
            <div className="border-t border-brand-gray/50 pt-3 space-y-2 text-[11px] text-gray-400">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-brand-yellow shrink-0" />
                <span>100% Genuine Official PIRSAPAAAD Products</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-yellow shrink-0" />
                <span>Direct Support: +91 7034044664</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
