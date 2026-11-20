import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Package, Truck, Printer, ArrowRight, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationPageProps {
  order: Order;
  onContinueShopping: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onContinueShopping,
}) => {
  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFE600', '#000000', '#ffffff', '#22c55e']
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const whatsappConfirmationLink = `https://wa.me/917034044664?text=${encodeURIComponent(
    `Hi PIRSAPAAAD Team! I just placed Order #${order.id} for ₹${order.total}. Customer Name: ${order.customer.fullName}, Phone: ${order.customer.phone}. Please confirm dispatch details.`
  )}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      {/* Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>
        <span className="text-xs font-black uppercase text-brand-yellow tracking-widest block">
          Order Successfully Placed
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Thank You, {order.customer.fullName.split(' ')[0]}!
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
          Your order has been recorded in our system. We are preparing your PIRSAPAAAD package for priority dispatch.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-brand-charcoal rounded-3xl border border-brand-gray/60 p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Order Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-gray/50 gap-2">
          <div>
            <span className="text-xs text-gray-400 block">Order Reference ID:</span>
            <span className="text-lg sm:text-xl font-black text-brand-yellow tracking-wider">
              #{order.id}
            </span>
          </div>
          <div className="sm:text-right">
            <span className="text-xs text-gray-400 block">Estimated Delivery:</span>
            <span className="text-xs sm:text-sm font-bold text-white">
              2 - 4 Business Days (Express Pan-India)
            </span>
          </div>
        </div>

        {/* Live Delivery Progress Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
            Order Status
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-1.5">
              <div className="w-8 h-8 mx-auto rounded-full bg-brand-yellow text-black flex items-center justify-center font-bold">
                ✓
              </div>
              <span className="font-bold text-white text-[11px] block">Confirmed</span>
            </div>
            <div className="space-y-1.5">
              <div className="w-8 h-8 mx-auto rounded-full bg-brand-yellow/20 text-brand-yellow border border-brand-yellow flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-medium text-gray-300 text-[11px] block">Packing</span>
            </div>
            <div className="space-y-1.5 opacity-50">
              <div className="w-8 h-8 mx-auto rounded-full bg-brand-gray text-gray-400 flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-gray-400 text-[11px] block">In Transit</span>
            </div>
            <div className="space-y-1.5 opacity-50">
              <div className="w-8 h-8 mx-auto rounded-full bg-brand-gray text-gray-400 flex items-center justify-center font-bold">
                4
              </div>
              <span className="text-gray-400 text-[11px] block">Delivered</span>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="border-t border-brand-gray/50 pt-4 space-y-3">
          <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
            Items Purchased
          </h4>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-brand-black p-3 rounded-2xl border border-brand-gray/60">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt=""
                    className="w-12 h-12 rounded-xl object-contain bg-white p-0.5"
                  />
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-white">{item.name}</h5>
                    <span className="text-[11px] text-gray-400">
                      Size: {item.size} • Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-brand-yellow">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address & Payment Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-brand-gray/50 pt-4 text-xs">
          <div className="space-y-1">
            <span className="text-gray-400 font-bold block uppercase text-[10px]">Shipping Address</span>
            <p className="text-white font-semibold">{order.customer.fullName}</p>
            <p className="text-gray-300">{order.customer.address}</p>
            <p className="text-gray-300">
              {order.customer.city}, {order.customer.state} - {order.customer.pincode}
            </p>
            <p className="text-brand-yellow font-semibold">Phone: {order.customer.phone}</p>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-gray-400 font-bold block uppercase text-[10px]">Payment Summary</span>
            <p className="text-gray-300">Method: <strong className="text-white">{order.paymentMethod}</strong></p>
            <p className="text-gray-300">Payment Status: <strong className="text-emerald-400">{order.paymentStatus}</strong></p>
            <div className="pt-2">
              <span className="text-base sm:text-xl font-black text-brand-yellow">
                Total Paid: ₹{order.total}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-brand-gray/50 pt-5 flex flex-col sm:flex-row gap-3">
          <a
            href={whatsappConfirmationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-3.5 px-4 rounded-xl text-center text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            <span>Confirm Order on WhatsApp</span>
          </a>

          <button
            onClick={handlePrint}
            className="bg-brand-gray hover:bg-brand-gray/80 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={onContinueShopping}
            className="bg-brand-yellow hover:bg-brand-yellow-dark text-black font-extrabold py-3.5 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-1 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
