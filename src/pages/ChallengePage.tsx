import React from 'react';
import { Sparkles, CheckCircle2, Clock, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { Product } from '../types';

interface ChallengePageProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
}

export const ChallengePage: React.FC<ChallengePageProps> = ({
  products,
  onOpenDetail,
  onInstantBuy,
}) => {
  const cream80g = products.find((p) => p.id === 'pirsapaaad-cream-80g') || products[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block bg-brand-yellow text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
          Official Clinical Routine
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          The PIRSAPAAAD <span className="text-brand-yellow">7-Day Transformation</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          Engineered for both men and women desiring fast, visible brightening without harmful bleaching agents or harsh chemical side effects.
        </p>
      </div>

      {/* Routine Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex space-x-4 items-start">
            <div className="w-10 h-10 rounded-2xl bg-brand-yellow text-black font-black text-base flex items-center justify-center shrink-0 shadow-glow-sm">
              AM
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Morning Glow Protocol</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Cleanse face with gentle face wash. Take an almond-sized dollop of PIRSAPAAAD Whitening Beauty Cream. Massage in gentle circular upward strokes over cheeks, forehead, and neck. Protects skin against daily sun and oxidative stress.
              </p>
            </div>
          </div>

          <div className="flex space-x-4 items-start">
            <div className="w-10 h-10 rounded-2xl bg-brand-charcoal border border-brand-yellow text-brand-yellow font-black text-base flex items-center justify-center shrink-0">
              PM
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Night Cellular Repair Protocol</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Before sleep, wash away dirt and pollutants. Re-apply a generous thin layer. Active Glutathione and Niacinamide deeply penetrate during overnight cellular regeneration to disperse melanin deposits.
              </p>
            </div>
          </div>

          <div className="bg-brand-charcoal p-5 rounded-2xl border border-brand-gray/60 space-y-2">
            <div className="flex items-center space-x-2 text-brand-yellow font-bold text-xs uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Results Within 7 Days:</span>
            </div>
            <ul className="text-xs text-gray-300 space-y-1.5 pl-6 list-disc">
              <li>Noticeably clearer, more luminous skin tone</li>
              <li>Significant fading of dark acne spots and hyperpigmentation</li>
              <li>Softened skin texture and refined pores</li>
              <li>Unisex formulation designed specifically for Indian skin</li>
            </ul>
          </div>
        </div>

        <div className="bg-brand-charcoal rounded-3xl p-6 border border-brand-yellow/30 shadow-2xl space-y-4 text-center">
          <div className="relative aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden bg-white p-2">
            <img
              src="/images/pirsapaaad-cream-official.jpg"
              alt="PIRSAPAAAD Whitening Beauty Cream 80g"
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
          <div>
            <span className="text-xs text-brand-yellow font-extrabold uppercase tracking-wider block">
              Flagship Jar
            </span>
            <h4 className="text-lg font-black text-white">
              PIRSAPAAAD Whitening Beauty Cream (80g)
            </h4>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <span className="text-2xl font-black text-brand-yellow">₹999</span>
              <span className="text-xs text-gray-400 line-through">₹1,499</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => cream80g && onOpenDetail(cream80g)}
              className="flex-1 bg-brand-black hover:bg-brand-gray text-white text-xs font-bold py-3 rounded-xl border border-brand-gray transition-colors"
            >
              Read Full Details
            </button>
            <button
              onClick={() => cream80g && onInstantBuy(cream80g)}
              className="flex-1 bg-brand-yellow hover:bg-brand-yellow-dark text-black text-xs font-black py-3 rounded-xl shadow-glow-yellow transition-all"
            >
              Start 7-Day Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
