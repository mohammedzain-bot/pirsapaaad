export interface Product {
  id: string;
  name: string;
  slug: string;
  size: string;
  category: 'Creams' | 'Fragrances' | 'Lip Care' | string;
  price: number;
  originalPrice: number;
  discount: number;
  tag?: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  headline?: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string;
  claims: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Customer {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  orderNotes?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: {
    id: string;
    name: string;
    size: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  createdAt: string;
}
