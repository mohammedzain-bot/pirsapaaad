import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  couponCode: string;
  couponMessage: string;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pirsapaaad_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('pirsapaaad_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1, selectedSize?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedSize: selectedSize || product.size }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscount(0);
    setCouponMessage('');
    localStorage.removeItem('pirsapaaad_cart');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Free shipping over ₹499, otherwise ₹50
  const shipping = subtotal >= 499 || subtotal === 0 ? 0 : 50;

  const applyCoupon = async (code: string): Promise<boolean> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return false;

    if (cleanCode === 'GLOW10') {
      const disc = Math.round(subtotal * 0.10);
      setDiscount(disc);
      setCouponCode(cleanCode);
      setCouponMessage('10% OFF applied successfully!');
      return true;
    }
    if (cleanCode === 'FIRSTBUY') {
      const disc = Math.round(subtotal * 0.15);
      setDiscount(disc);
      setCouponCode(cleanCode);
      setCouponMessage('15% First-Timer Special applied!');
      return true;
    }
    if (cleanCode === 'PIRSA100') {
      const disc = subtotal >= 499 ? 100 : 0;
      if (disc === 0) {
        setCouponMessage('Minimum order ₹499 required for PIRSA100');
        return false;
      }
      setDiscount(100);
      setCouponCode(cleanCode);
      setCouponMessage('₹100 Instant Discount applied!');
      return true;
    }

    setCouponMessage('Invalid or expired coupon code');
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    setCouponMessage('');
  };

  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        subtotal,
        discount,
        couponCode,
        couponMessage,
        applyCoupon,
        removeCoupon,
        shipping,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
