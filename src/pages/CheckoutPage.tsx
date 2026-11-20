import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, CheckCircle2, Lock, Smartphone, CreditCard, Truck, AlertCircle, Sparkles, QrCode } from 'lucide-react';
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

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [upiId, setUpiId] = useState('');
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
      setErrorMsg('Please enter a valid 10-digit mobile number for delivery updates');
      return;
    }
    if (!customer.address.trim()) {
      setErrorMsg('Please enter your delivery street address');
      return;
    }
    if (!customer.pincode.trim() || customer.pincode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code');
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
        paymentMethod:
          paymentMethod === 'upi'
            ? `UPI (${upiApp.toUpperCase()})`
            : paymentMethod === 'cod'
            ? 'Cash on Delivery (COD)'
            : 'Prepaid Card / Netbanking',
        paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (data.success && data.order) {
        clearCart();
        onOrderSuccess(data.order);
      } else {
        setErrorMsg('Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please check connection.');
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-brand-yellow font-bold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customer Info & Payment */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Delivery Details */}
            <div className="bg-brand-charcoal p-5 sm:p-6 rounded-2xl border border-brand-gray/60 space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-brand-gray/50">
                <span className="w-6 h-6 rounded-full bg-brand-yellow text-black font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base font-bold text-white">Delivery Address</h3>
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
                  <label className="text-xs font-semibold text-gray-300">Mobile Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit number"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-brand-black border border-brand-gray/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="For order receipt & tracking"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-brand-black border border-brand-gray/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Street Address & Landmark *</label>
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
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-brand-charcoal p-5 sm:p-6 rounded-2xl border border-brand-gray/60 space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-brand-gray/50">
                <span className="w-6 h-6 rounded-full bg-brand-yellow text-black font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="text-base font-bold text-white">Payment Options (India)</h3>
              </div>

              {/* Payment Selectors */}
              <div className="space-y-3">
                {/* 1. UPI Option */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-brand-yellow bg-brand-yellow/10'
                      : 'border-brand-gray/60 bg-brand-black hover:border-brand-gray'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center border-brand-yellow">
                        {paymentMethod === 'upi' && (
                          <div className="w-2 h-2 rounded-full bg-brand-yellow" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white block">UPI Instant Payment</span>
                        <span className="text-[11px] text-gray-400">Google Pay, PhonePe, Paytm, QR Code</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                      FASTEST
                    </span>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-4 pt-4 border-t border-brand-gray/50 space-y-3">
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => setUpiApp('gpay')}
                          className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                            upiApp === 'gpay'
                              ? 'bg-brand-yellow text-black border-brand-yellow'
                              : 'bg-brand-gray/50 text-gray-300 border-brand-gray'
                          }`}
                        >
                          Google Pay
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpiApp('phonepe')}
                          className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                            upiApp === 'phonepe'
                              ? 'bg-brand-yellow text-black border-brand-yellow'
                              : 'bg-brand-gray/50 text-gray-300 border-brand-gray'
                          }`}
                        >
                          PhonePe
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpiApp('paytm')}
                          className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                            upiApp === 'paytm'
                              ? 'bg-brand-yellow text-black border-brand-yellow'
                              : 'bg-brand-gray/50 text-gray-300 border-brand-gray'
                          }`}
                        >
                          Paytm
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpiApp('qr')}
                          className={`p-2 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center space-x-1 ${
                            upiApp === 'qr'
                              ? 'bg-brand-yellow text-black border-brand-yellow'
                              : 'bg-brand-gray/50 text-gray-300 border-brand-gray'
                          }`}
                        >
                          <QrCode className="w-3 h-3" />
                          <span>Scan QR</span>
                        </button>
                      </div>

                      {upiApp === 'qr' ? (
                        <div className="bg-brand-black p-4 rounded-xl text-center space-y-2 border border-brand-gray/70">
                          <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                            {/* Realistic Simulated UPI QR Code SVG */}
                            <svg className="w-full h-full text-black" viewBox="0 0 100 100">
                              <rect width="100" height="100" fill="white" />
                              <rect x="10" y="10" width="25" height="25" fill="black" />
                              <rect x="15" y="15" width="15" height="15" fill="white" />
                              <rect x="18" y="18" width="9" height="9" fill="black" />
                              <rect x="65" y="10" width="25" height="25" fill="black" />
                              <rect x="70" y="15" width="15" height="15" fill="white" />
                              <rect x="73" y="18" width="9" height="9" fill="black" />
                              <rect x="10" y="65" width="25" height="25" fill="black" />
                              <rect x="15" y="70" width="15" height="15" fill="white" />
                              <rect x="18" y="73" width="9" height="9" fill="black" />
                              <rect x="42" y="42" width="16" height="16" fill="#FFE600" />
                              <rect x="45" y="15" width="6" height="12" fill="black" />
                              <rect x="55" y="25" width="6" height="6" fill="black" />
                              <rect x="42" y="65" width="10" height="10" fill="black" />
                              <rect x="65" y="55" width="12" height="6" fill="black" />
                              <rect x="75" y="75" width="15" height="15" fill="black" />
                            </svg>
                          </div>
                          <span className="text-[11px] text-gray-400 block">
                            Scan with any UPI App • Receiver: <strong>pirsapaaad@upi</strong>
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <label className="text-[11px] text-gray-400">
                            Enter UPI ID or Mobile Number (Optional for test):
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. yourname@oksbi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full bg-brand-black border border-brand-gray/80 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-brand-yellow bg-brand-yellow/10'
                      : 'border-brand-gray/60 bg-brand-black hover:border-brand-gray'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center border-brand-yellow">
                      {paymentMethod === 'cod' && (
                        <div className="w-2 h-2 rounded-full bg-brand-yellow" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-gray-400">Pay cash or UPI directly to courier upon delivery</span>
                    </div>
                  </div>
                </div>

                {/* 3. Cards / Netbanking */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-brand-yellow bg-brand-yellow/10'
                      : 'border-brand-gray/60 bg-brand-black hover:border-brand-gray'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center border-brand-yellow">
                      {paymentMethod === 'card' && (
                        <div className="w-2 h-2 rounded-full bg-brand-yellow" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">Credit / Debit Card & Netbanking</span>
                      <span className="text-[11px] text-gray-400">Visa, MasterCard, RuPay & all Indian Banks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-yellow hover:bg-brand-yellow-dark text-black font-black text-base py-4 px-6 rounded-2xl shadow-glow-yellow transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 fill-black" />
                  <span>Place Order • ₹{total}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-brand-charcoal p-5 sm:p-6 rounded-2xl border border-brand-gray/60 space-y-4 sticky top-24">
            <h3 className="text-base font-bold text-white pb-3 border-b border-brand-gray/50">
              Order Summary ({cart.length} items)
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-12 h-12 rounded-lg object-contain bg-white p-0.5 border border-brand-gray"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-white block line-clamp-1">{item.product.name}</span>
                    <span className="text-gray-400 text-[11px]">
                      Qty: {item.quantity} • {item.selectedSize || item.product.size}
                    </span>
                  </div>
                  <span className="font-extrabold text-brand-yellow">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="border-t border-brand-gray/50 pt-3 space-y-2 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-white">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Delivery</span>
                <span className="font-semibold text-white">
                  {shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${shipping}`}
                </span>
              </div>
              <div className="border-t border-brand-gray/50 pt-3 flex justify-between text-base font-black text-white">
                <span>Total Due</span>
                <span className="text-brand-yellow text-xl">₹{total}</span>
              </div>
            </div>

            <div className="bg-brand-black/60 p-3 rounded-xl border border-brand-gray/40 text-[11px] text-gray-400 space-y-1">
              <div className="flex items-center space-x-1.5 text-brand-yellow font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PIRSAPAAAD 7-Day Guarantee</span>
              </div>
              <p>Every order is backed by genuine manufacturer quality guarantee and direct WhatsApp customer support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
