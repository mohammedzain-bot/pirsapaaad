import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  products: Product[];
  initialCategory?: string;
  onOpenDetail: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  initialCategory = 'All',
  onOpenDetail,
  onInstantBuy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const categories = ['All', 'Creams', 'Fragrances', 'Lip Care'];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by category
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-brand-yellow text-xs font-black tracking-widest uppercase">
          Unisex Beauty & Personal Care
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          The PIRSAPAAAD Store
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Discover certified high-potency whitening treatments, 0% alcohol attars, and restorative lip butters.
        </p>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-brand-charcoal/80 p-4 rounded-2xl border border-brand-gray/60 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-yellow text-black shadow-glow-sm'
                  : 'bg-brand-black text-gray-300 hover:text-white hover:bg-brand-gray/50 border border-brand-gray/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-brand-black border border-brand-gray/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:border-brand-yellow focus:outline-none"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-brand-black border border-brand-gray/80 text-gray-200 text-xs font-semibold rounded-xl px-3 py-2 focus:border-brand-yellow focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Counter */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Showing {filteredProducts.length} items</span>
        {selectedCategory !== 'All' && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-brand-yellow hover:underline font-semibold"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Mobile 2-Column, Desktop 4-Column Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-brand-charcoal/40 rounded-3xl border border-brand-gray/40 space-y-3">
          <p className="text-gray-400 text-sm">No products found matching your search.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="bg-brand-yellow text-black font-bold text-xs py-2 px-5 rounded-xl hover:bg-brand-yellow-dark transition-colors"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetail={onOpenDetail}
              onInstantBuy={onInstantBuy}
            />
          ))}
        </div>
      )}
    </div>
  );
};
