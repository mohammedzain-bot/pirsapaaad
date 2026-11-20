import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, Clock, AlertCircle, Package, ArrowRight } from 'lucide-react';
import { Order } from '../types';

interface TrackOrderPageProps {
  onOpenOrderConfirmation?: (order: Order) => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = () => {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setOrder(null);

    try {
      // Clean query (e.g. #PIR-90412 or PIR-90412)
      const cleanId = query.replace('#', '').trim();
      const res = await fetch(`/api/orders/${cleanId}`);
      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        // Fallback: search by phone number from all orders
        const allRes = await fetch('/api/orders');
        const allData = await allRes.json();
        if (allData.success) {
          const matched = allData.orders.find(
            (o: Order) =>
              o.customer.phone.includes(cleanId) ||
              o.id.toLowerCase() === cleanId.toLowerCase()
          );
          if (matched) {
            setOrder(matched);
            return;
          }
        }
        setErrorMsg('No order found with this Reference ID or Phone number.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch tracking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-black uppercase text-brand-yellow tracking-widest block">
          Pan-India Express Tracking
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Track Your PIRSAPAAAD Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Enter your Order ID (e.g. <strong className="text-brand-yellow">PIR-90412</strong>) or registered phone number.
        </p>
      </div>

      {/* Tracking Search Input Card */}
      <div className="bg-brand-charcoal p-5 sm:p-8 rounded-3xl border border-brand-gray/60 max-w-2xl mx-auto">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. PIR-90412 or 9876543210"
              className="w-full bg-brand-black border border-brand-gray/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-brand-yellow focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-yellow hover:bg-brand-yellow-dark text-black font-extrabold text-sm py-3 px-6 rounded-xl transition-all shadow-glow-yellow flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Tracking...</span>
            ) : (
              <>
                <span>Track Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 flex items-center space-x-2 bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Tracking Results Card */}
      {order && (
        <div className="bg-brand-charcoal p-6 sm:p-8 rounded-3xl border border-brand-gray/60 space-y-6 animate-in slide-in-from-bottom-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-gray/50 gap-2">
            <div>
              <span className="text-xs text-gray-400 block">Tracking Order:</span>
              <span className="text-xl font-black text-brand-yellow">#{order.id}</span>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-gray-400 block">Courier AWB / Tracking:</span>
              <span className="text-xs sm:text-sm font-bold text-white bg-brand-black px-2.5 py-1 rounded-md border border-brand-gray">
                {order.trackingNumber}
              </span>
            </div>
          </div>

          {/* Interactive Visual Tracking Timeline */}
          <div className="py-2">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="space-y-1.5">
                <div className="w-8 h-8 mx-auto rounded-full bg-brand-yellow text-black flex items-center justify-center font-bold">
                  ✓
                </div>
                <span className="font-bold text-white text-[11px] block">Order Placed</span>
                <span className="text-[10px] text-gray-400">Verified</span>
              </div>

              <div className="space-y-1.5">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                    order.orderStatus === 'Processing' ||
                    order.orderStatus === 'Shipped' ||
                    order.orderStatus === 'Delivered'
                      ? 'bg-brand-yellow text-black'
                      : 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow'
                  }`}
                >
                  ✓
                </div>
                <span className="font-bold text-white text-[11px] block">Packed</span>
                <span className="text-[10px] text-gray-400">Quality Checked</span>
              </div>

              <div className="space-y-1.5">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                    order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered'
                      ? 'bg-brand-yellow text-black'
                      : 'bg-brand-gray text-gray-400'
                  }`}
                >
                  {order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? '✓' : '3'}
                </div>
                <span
                  className={`text-[11px] block font-bold ${
                    order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered'
                      ? 'text-white'
                      : 'text-gray-400'
                  }`}
                >
                  In Transit
                </span>
                <span className="text-[10px] text-gray-400">Express Courier</span>
              </div>

              <div className="space-y-1.5">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                    order.orderStatus === 'Delivered'
                      ? 'bg-emerald-500 text-black'
                      : 'bg-brand-gray text-gray-400'
                  }`}
                >
                  {order.orderStatus === 'Delivered' ? '✓' : '4'}
                </div>
                <span
                  className={`text-[11px] block font-bold ${
                    order.orderStatus === 'Delivered' ? 'text-emerald-400' : 'text-gray-400'
                  }`}
                >
                  Delivered
                </span>
                <span className="text-[10px] text-gray-400">Destination</span>
              </div>
            </div>
          </div>

          {/* Details summary */}
          <div className="bg-brand-black p-4 rounded-2xl border border-brand-gray/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 block text-[11px]">Shipping Destination:</span>
              <p className="font-bold text-white mt-0.5">{order.customer.fullName}</p>
              <p className="text-gray-300">{order.customer.address}</p>
              <p className="text-gray-300">
                {order.customer.city}, {order.customer.state} - {order.customer.pincode}
              </p>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Order Contents:</span>
              <ul className="mt-1 space-y-1">
                {order.items.map((it, idx) => (
                  <li key={idx} className="text-gray-200">
                    • {it.name} ({it.size}) × {it.quantity}
                  </li>
                ))}
              </ul>
              <p className="text-brand-yellow font-extrabold mt-2">Total Value: ₹{order.total}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
