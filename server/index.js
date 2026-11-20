import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Serve static images & public assets
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));
app.use(express.static(path.join(__dirname, '..', 'dist')));

const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const CONTACTS_FILE = path.join(__dirname, 'data', 'contacts.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Helper to read / write JSON
function readJSON(filePath, defaultData = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultData;
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// Pincode directory for Indian cities
const PINCODES = {
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '560001': { city: 'Bengaluru', state: 'Karnataka' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
  '500001': { city: 'Hyderabad', state: 'Telangana' },
  '380009': { city: 'Ahmedabad', state: 'Gujarat' },
  '302001': { city: 'Jaipur', state: 'Rajasthan' },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '160022': { city: 'Chandigarh', state: 'Punjab' },
  '682001': { city: 'Kochi', state: 'Kerala' },
  '411001': { city: 'Pune', state: 'Maharashtra' },
  '190001': { city: 'Srinagar', state: 'Jammu & Kashmir' }
};

// ================= API ROUTES ================= //

// 1. Get all products
app.get('/api/products', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const { category, search, sort } = req.query;
  let filtered = [...products];

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.shortDescription.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  res.json({ success: true, count: filtered.length, products: filtered });
});

// 2. Get single product
app.get('/api/products/:id', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const product = products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

// 3. Admin: Create product
app.post('/api/products', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const newProduct = {
    id: req.body.id || 'pirsa-' + Date.now(),
    slug: (req.body.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: req.body.name,
    size: req.body.size || '50g',
    category: req.body.category || 'Creams',
    price: Number(req.body.price),
    originalPrice: Number(req.body.originalPrice || req.body.price * 1.3),
    discount: Math.round(((req.body.originalPrice - req.body.price) / req.body.originalPrice) * 100) || 20,
    tag: req.body.tag || 'NEW',
    badge: req.body.badge || '',
    rating: Number(req.body.rating || 4.8),
    reviewCount: Number(req.body.reviewCount || 100),
    stock: Number(req.body.stock || 50),
    images: req.body.images && req.body.images.length > 0 ? req.body.images : ['/images/cream-80g-studio.jpg'],
    headline: req.body.headline || 'PIRSAPAAAD Luxury Formula',
    shortDescription: req.body.shortDescription || '',
    description: req.body.description || '',
    benefits: req.body.benefits || ['Guaranteed visible glow', 'Unisex active formula'],
    ingredients: req.body.ingredients || ['Glutathione', 'Niacinamide'],
    howToUse: req.body.howToUse || 'Apply twice daily onto cleansed skin.',
    claims: req.body.claims || ['100% Authentic Unisex Formula'],
    isFeatured: Boolean(req.body.isFeatured),
    isBestSeller: Boolean(req.body.isBestSeller)
  };

  products.unshift(newProduct);
  writeJSON(PRODUCTS_FILE, products);
  res.status(201).json({ success: true, product: newProduct });
});

// 4. Admin: Update product
app.put('/api/products/:id', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  products[index] = { ...products[index], ...req.body };
  writeJSON(PRODUCTS_FILE, products);
  res.json({ success: true, product: products[index] });
});

// 5. Admin: Delete product
app.delete('/api/products/:id', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const filtered = products.filter(p => p.id !== req.params.id);
  if (filtered.length === products.length) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  writeJSON(PRODUCTS_FILE, filtered);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// 6. Orders: Create order
app.post('/api/orders', (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const orderId = 'PIR-' + Math.floor(10000 + Math.random() * 90000);
  
  const newOrder = {
    id: orderId,
    customer: req.body.customer,
    items: req.body.items,
    subtotal: req.body.subtotal,
    discount: req.body.discount || 0,
    shipping: req.body.shipping || 0,
    total: req.body.total,
    paymentMethod: req.body.paymentMethod || 'UPI',
    paymentStatus: req.body.paymentStatus || 'Paid',
    orderStatus: 'Confirmed',
    trackingNumber: 'PIR-EXP-' + Math.floor(10000000 + Math.random() * 90000000),
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  writeJSON(ORDERS_FILE, orders);

  // Decrement stock in products
  const products = readJSON(PRODUCTS_FILE);
  newOrder.items.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (prod && prod.stock >= item.quantity) {
      prod.stock -= item.quantity;
    }
  });
  writeJSON(PRODUCTS_FILE, products);

  res.status(201).json({ success: true, order: newOrder });
});

// 7. Get all orders (Admin / user tracking)
app.get('/api/orders', (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  res.json({ success: true, count: orders.length, orders });
});

// 8. Get single order by ID
app.get('/api/orders/:id', (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const order = orders.find(o => o.id.toUpperCase() === req.params.id.toUpperCase());
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

// 9. Admin: Update order status
app.put('/api/orders/:id/status', (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const order = orders.find(o => o.id.toUpperCase() === req.params.id.toUpperCase());
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  order.orderStatus = req.body.status || order.orderStatus;
  if (req.body.trackingNumber) {
    order.trackingNumber = req.body.trackingNumber;
  }
  writeJSON(ORDERS_FILE, orders);
  res.json({ success: true, order });
});

// 10. Coupons validation
app.post('/api/coupon/validate', (req, res) => {
  const { code, cartTotal } = req.body;
  if (!code) return res.status(400).json({ success: false, message: 'No code provided' });

  const upper = code.trim().toUpperCase();
  if (upper === 'GLOW10') {
    const discount = Math.round(cartTotal * 0.10);
    return res.json({ success: true, code: upper, discount, message: '10% OFF Applied!' });
  }
  if (upper === 'FIRSTBUY') {
    const discount = Math.round(cartTotal * 0.15);
    return res.json({ success: true, code: upper, discount, message: '15% New Customer Discount!' });
  }
  if (upper === 'PIRSA100') {
    const discount = 100;
    return res.json({ success: true, code: upper, discount, message: '₹100 Flat Savings Applied!' });
  }

  res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
});

// 11. Pincode lookup
app.get('/api/pincode/:pin', (req, res) => {
  const pin = req.params.pin;
  if (PINCODES[pin]) {
    return res.json({ success: true, ...PINCODES[pin] });
  }
  // Generic fallback if not in mock map
  res.json({ success: true, city: '', state: '' });
});

// 12. Contact Form
app.post('/api/contact', (req, res) => {
  const contacts = readJSON(CONTACTS_FILE);
  const newContact = {
    id: 'MSG-' + Date.now(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
    createdAt: new Date().toISOString()
  };
  contacts.unshift(newContact);
  writeJSON(CONTACTS_FILE, contacts);
  res.json({ success: true, message: 'Thank you! Our PIRSAPAAAD beauty advisors will connect with you.' });
});

// 13. Admin Analytics Stats
app.get('/api/stats', (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const products = readJSON(PRODUCTS_FILE);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : o.total), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing').length;
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
  const totalProducts = products.length;

  res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalProducts,
      averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    }
  });
});

// SPA Fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexFile = path.join(__dirname, '..', 'dist', 'index.html');
  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }
  next();
});

app.listen(PORT, () => {
  console.log(`PIRSAPAAAD Backend running on http://localhost:${PORT}`);
});
