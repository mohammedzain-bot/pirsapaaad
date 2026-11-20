import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AdminPage } from './pages/AdminPage';
import { ChallengePage } from './pages/ChallengePage';
import { Product, Order } from './types';

const defaultProducts: Product[] = [
  {
    id: "pirsapaaad-cream-80g",
    name: "PIRSAPAAAD Whitening Beauty Cream",
    slug: "pirsapaaad-whitening-beauty-cream-80g",
    size: "80g",
    category: "Creams",
    price: 999,
    originalPrice: 1499,
    discount: 33,
    tag: "BESTSELLER",
    badge: "7.5% GLUTATHIONE",
    rating: 4.8,
    reviewCount: 42350,
    stock: 185,
    images: [
      "/images/pirsapaaad-cream-official.jpg",
      "/images/cream-80g-studio.jpg",
      "/images/product-cream-80g-authentic.png",
      "/images/cream-jar-ad.png",
      "/images/pirsapaaad-banner.jpg"
    ],
    headline: "Visibly Fair, Younger, Radiant Skin In 7 Days",
    shortDescription: "Flagship 80g unisex skincare formula for intense brightening, dark-spot reduction, and even tone.",
    description: "PIRSAPAAAD Whitening Beauty Cream is engineered with clinical-grade active botanicals and brightening agents. Tailored specifically for both women and men, this luxurious formula targets melanin hyperpigmentation, uneven skin tone, acne marks, and dullness.",
    benefits: [
      "Promotes visible glow & fair complexion in 7 days",
      "Fades stubborn blemishes, dark spots, and discoloration",
      "Deeply hydrates without greasy residue",
      "Protects skin barrier against environmental pollution",
      "Formulated for all Indian skin types (Oily, Dry & Combination)"
    ],
    ingredients: [
      "Glutathione (L-Glutathione)",
      "Niacinamide (Vitamin B3 5%)",
      "Kojic Acid Dipalmitate",
      "Licorice Root Extract",
      "Alpha Arbutin",
      "Shea Butter & Vitamin E",
      "Hyaluronic Acid"
    ],
    howToUse: "1. Cleanse face with lukewarm water and pat dry with a soft towel.\n2. Scoop a small amount on fingertips.\n3. Gently massage in upward circular motions across face and neck.\n4. Use consistently every morning and night for 7 consecutive days for peak results.",
    claims: [
      "100% Authentic Unisex Formula",
      "Dermatologically Tested",
      "Paraben & Sulfate Free",
      "Cruelty-Free / No Animal Testing",
      "100% Genuine Certified Formulation"
    ],
    isFeatured: true,
    isBestSeller: true
  },
  {
    id: "pirsapaaad-cream-35g",
    name: "PIRSAPAAAD Whitening Beauty Cream (Starter Pack)",
    slug: "pirsapaaad-whitening-beauty-cream-35g",
    size: "35g",
    category: "Creams",
    price: 499,
    originalPrice: 799,
    discount: 38,
    tag: "POPULAR",
    badge: "STARTER PACK",
    rating: 4.7,
    reviewCount: 38100,
    stock: 240,
    images: [
      "/images/pirsapaaad-cream-official.jpg",
      "/images/product-cream-35g-authentic.png",
      "/images/cream-80g-studio.jpg",
      "/images/cream-jar-ad.png"
    ],
    headline: "The Compact Starter Edition for Instant 7-Day Glow",
    shortDescription: "Compact 35g starter jar. Perfect travel companion to experience PIRSAPAAAD skin transformation.",
    description: "Ideal entry into the PIRSAPAAAD 7-Day Challenge. Compact 35g edition holds the exact high-potency skin whitening and tone-correcting formula as our 80g flagship jar.",
    benefits: [
      "Convenient travel & gym size",
      "Exact same high-potency 7-day whitening actives",
      "Lightweight, fast-absorbing texture",
      "Ideal starter pack for first-time users"
    ],
    ingredients: [
      "Glutathione",
      "Niacinamide 5%",
      "Kojic Acid Dipalmitate",
      "Licorice Root Extract",
      "Vitamin E & Botanical Lipids"
    ],
    howToUse: "Apply once in the morning and once before bedtime after cleansing.",
    claims: [
      "Compact 35g travel jar",
      "100% Unisex Formulation",
      "Non-Comedogenic & Non-Greasy"
    ],
    isFeatured: true,
    isBestSeller: false
  },
  {
    id: "pirsapaaad-perfume-6ml",
    name: "PIRSAPAAAD Roll-On Perfume (Desire Attar)",
    slug: "pirsapaaad-roll-on-perfume-6ml",
    size: "6ml",
    category: "Fragrances",
    price: 99,
    originalPrice: 199,
    discount: 50,
    tag: "HOT DEAL",
    badge: "0% ALCOHOL",
    rating: 4.6,
    reviewCount: 15420,
    stock: 420,
    images: [
      "/images/pirsapaaad-perfume-official.jpg",
      "/images/perfume-studio.jpg",
      "/images/product-perfume-authentic.png"
    ],
    headline: "100% Alcohol-Free Pure Luxury Pocket Attar",
    shortDescription: "Concentrated luxury roll-on perfume oil (Desire Attar). 14+ hours long-lasting unisex scent.",
    description: "PIRSAPAAAD Desire Attar is a pure, concentrated perfume oil formulated without any alcohol. Infused with alluring amber, warm sandalwood, soft white florals, and rich musk notes.",
    benefits: [
      "100% Free From Alcohol – skin-friendly & non-drying",
      "Roll-on applicator for zero-spill convenience",
      "Long-lasting concentrated formula (up to 14+ hours)",
      "Universal unisex aromatic profile suited for day & evening"
    ],
    ingredients: [
      "Concentrated Perfume Oil",
      "Natural Plant Essential Extracts",
      "Dipropylene Glycol",
      "No Alcohol / No Denatured Spirits"
    ],
    howToUse: "Roll gently on collarbone, wrists, and pulse points. Rub wrists lightly.",
    claims: [
      "100% Halal & Alcohol-Free",
      "Pocket Friendly 6ml Bottle",
      "Gentle on Sensitive Skin"
    ],
    isFeatured: true,
    isBestSeller: true
  },
  {
    id: "pirsapaaad-lip-balm",
    name: "PIRSAPAAAD Nourishing Lip Balm",
    slug: "pirsapaaad-lip-balm",
    size: "10g",
    category: "Lip Care",
    price: 249,
    originalPrice: 399,
    discount: 38,
    tag: "HYDRATION",
    badge: "100% RESULT",
    rating: 4.8,
    reviewCount: 9230,
    stock: 190,
    images: [
      "/images/pirsapaaad-lipbalm-official.jpg",
      "/images/lipbalm-studio.jpg",
      "/images/product-lipbalm-authentic.png"
    ],
    headline: "Instant Repair & Hydrating Tinted Lip Butter",
    shortDescription: "Intensely moisturizing tinted unisex lip balm with organic beeswax, shea butter & SPF protection.",
    description: "Say goodbye to dark, cracked, and dry lips. PIRSAPAAAD Nourishing Lip Balm deeply penetrates delicate lip tissue with vitamin-rich oils to soften lips and restore healthy, natural rosy glow.",
    benefits: [
      "Reverses lip darkness and hyperpigmentation",
      "Heals severe lip chapping within 24 hours",
      "Subtle natural healthy tint for both men and women",
      "Infused with natural SPF barrier"
    ],
    ingredients: [
      "Organic Beeswax",
      "Pure Shea Butter",
      "Cold-Pressed Jojoba Oil",
      "Vitamin E (Tocopherol)",
      "Natural Beetroot Extract",
      "Sweet Almond Oil"
    ],
    howToUse: "Glide balm over lips as often as needed throughout the day and before sleep.",
    claims: [
      "No Chemical Dyes or Mineral Oils",
      "100% Organic Moisture Lock",
      "Cruelty-Free"
    ],
    isFeatured: true,
    isBestSeller: false
  }
];

const MainContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const { addToCart, setIsCartOpen } = useCart();

  // Load products from API
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.log('Using local products fallback:', err));
  }, []);

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInstantBuy = (product: Product, quantity: number = 1, size?: string) => {
    addToCart(product, quantity, size);
    setIsCartOpen(false);
    setCurrentTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setCompletedOrder(order);
    setCurrentTab('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Cart Drawer Panel */}
      <CartDrawer
        onCheckout={() => {
          setCurrentTab('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating Elements */}
      <FloatingWhatsApp />
      <MobileNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Page Body */}
      <main className="flex-1 pb-16 md:pb-0">
        {currentTab === 'home' && (
          <HomePage
            products={products}
            onOpenDetail={handleOpenDetail}
            onInstantBuy={handleInstantBuy}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'shop' && (
          <ShopPage
            products={products}
            initialCategory="All"
            onOpenDetail={handleOpenDetail}
            onInstantBuy={handleInstantBuy}
          />
        )}

        {currentTab === 'shop-cream' && (
          <ShopPage
            products={products}
            initialCategory="Creams"
            onOpenDetail={handleOpenDetail}
            onInstantBuy={handleInstantBuy}
          />
        )}

        {currentTab === 'shop-fragrance' && (
          <ShopPage
            products={products}
            initialCategory="Fragrances"
            onOpenDetail={handleOpenDetail}
            onInstantBuy={handleInstantBuy}
          />
        )}

        {currentTab === 'shop-lip' && (
          <ShopPage
            products={products}
            initialCategory="Lip Care"
            onOpenDetail={handleOpenDetail}
            onInstantBuy={handleInstantBuy}
          />
        )}

        {currentTab === 'detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={() => setCurrentTab('shop')}
            onInstantBuy={handleInstantBuy}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentTab === 'challenge' && (
          <ChallengePage
            products={products}
            onOpenDetail={handleOpenDetail}
            onInstantBuy={handleInstantBuy}
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutPage
            onBack={() => setCurrentTab('shop')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentTab === 'confirmation' && completedOrder && (
          <OrderConfirmationPage
            order={completedOrder}
            onContinueShopping={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'track' && <TrackOrderPage />}

        {currentTab === 'admin' && <AdminPage />}
      </main>

      {/* Comprehensive Footer */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
};

export default App;
