import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, RefreshCw, DollarSign, Package, ShoppingCart, Users, AlertCircle, Eye, ArrowUpRight } from 'lucide-react';
import { Product, Order } from '../types';

interface AdminPageProps {
  onRefreshData?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<any>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalProducts: 0,
    averageOrderValue: 0
  });

  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Fetch all orders, products, and stats
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, prodRes, statRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/stats')
      ]);

      const ordData = await ordRes.json();
      const prodData = await prodRes.json();
      const statData = await statRes.json();

      if (ordData.success) setOrders(ordData.orders);
      if (prodData.success) setProducts(prodData.products);
      if (statData.success) setStats(statData.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showSuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(`Order #${orderId} marked as ${newStatus}`);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Product removed successfully');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const productPayload = {
      name: formData.get('name') as string,
      size: formData.get('size') as string,
      category: formData.get('category') as string,
      price: Number(formData.get('price')),
      originalPrice: Number(formData.get('originalPrice')),
      stock: Number(formData.get('stock')),
      tag: formData.get('tag') as string,
      shortDescription: formData.get('shortDescription') as string,
      description: formData.get('description') as string,
      images: [
        (formData.get('image') as string) || '/images/cream-80g-studio.jpg'
      ]
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productPayload)
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productPayload)
        });
      }

      const data = await res.json();
      if (data.success) {
        showSuccess(editingProduct ? 'Product updated!' : 'New product created!');
        setIsModalOpen(false);
        setEditingProduct(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Admin Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-gray/60">
        <div>
          <span className="text-xs font-black uppercase text-brand-yellow tracking-widest block">
            Store Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            PIRSAPAAAD Admin Portal
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-brand-charcoal hover:bg-brand-gray text-gray-300 border border-brand-gray flex items-center space-x-1.5 text-xs font-bold transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="bg-brand-yellow hover:bg-brand-yellow-dark text-black font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center space-x-1.5 shadow-glow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 p-3 rounded-2xl flex items-center space-x-2 text-xs text-emerald-400 font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-charcoal p-5 rounded-2xl border border-brand-gray/60">
          <span className="text-xs text-gray-400 font-semibold block">Total Revenue</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-brand-yellow">
              ₹{stats.totalRevenue.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold block mt-1">+18% this week</span>
        </div>

        <div className="bg-brand-charcoal p-5 rounded-2xl border border-brand-gray/60">
          <span className="text-xs text-gray-400 font-semibold block">Total Orders</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {stats.totalOrders}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block mt-1">Processed in DB</span>
        </div>

        <div className="bg-brand-charcoal p-5 rounded-2xl border border-brand-gray/60">
          <span className="text-xs text-gray-400 font-semibold block">Pending Dispatch</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">
              {stats.pendingOrders}
            </span>
          </div>
          <span className="text-[10px] text-amber-300 font-bold block mt-1">Requires packaging</span>
        </div>

        <div className="bg-brand-charcoal p-5 rounded-2xl border border-brand-gray/60">
          <span className="text-xs text-gray-400 font-semibold block">Active Products</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {stats.totalProducts}
            </span>
          </div>
          <span className="text-[10px] text-brand-yellow font-bold block mt-1">In Catalog</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-brand-gray/60 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'orders'
              ? 'bg-brand-yellow text-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Customer Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'products'
              ? 'bg-brand-yellow text-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Manage Products ({products.length})
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-brand-charcoal rounded-3xl border border-brand-gray/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-black text-gray-400 uppercase font-black text-[10px] border-b border-brand-gray/60">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray/40 text-gray-200">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-brand-black/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-yellow">
                      #{ord.id}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-white block">{ord.customer.fullName}</span>
                      <span className="text-[11px] text-gray-400">{ord.customer.phone}</span>
                      <span className="text-[10px] text-gray-500 block">
                        {ord.customer.city}, {ord.customer.state}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="text-[11px]">
                            • {it.name} ({it.size}) × {it.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-extrabold text-sm text-white">
                      ₹{ord.total}
                    </td>
                    <td className="p-4">
                      <span className="block text-[11px] font-semibold">{ord.paymentMethod}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          ord.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex space-x-1">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-brand-black border border-brand-gray text-[11px] text-gray-200 rounded-lg p-1 font-semibold focus:outline-none"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Products CRUD Management */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-brand-charcoal rounded-2xl border border-brand-gray/60 p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="relative aspect-square rounded-xl bg-white overflow-hidden p-2 flex items-center justify-center">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                  <span className="absolute top-2 left-2 bg-black text-brand-yellow text-[9px] font-black px-2 py-0.5 rounded">
                    {prod.size}
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs line-clamp-2">{prod.name}</h4>
                <div className="flex items-baseline space-x-2">
                  <span className="text-base font-black text-brand-yellow">₹{prod.price}</span>
                  <span className="text-xs text-gray-500 line-through">₹{prod.originalPrice}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Stock: {prod.stock}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-gray/50">
                <button
                  onClick={() => {
                    setEditingProduct(prod);
                    setIsModalOpen(true);
                  }}
                  className="bg-brand-black hover:bg-brand-gray text-white p-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 border border-brand-gray"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteProduct(prod.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 border border-red-500/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-charcoal border border-brand-gray rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Product Name *</label>
                <input
                  name="name"
                  required
                  defaultValue={editingProduct?.name || ''}
                  placeholder="e.g. PIRSAPAAAD Whitening Beauty Cream"
                  className="w-full bg-brand-black border border-brand-gray rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Size / Weight *</label>
                  <input
                    name="size"
                    required
                    defaultValue={editingProduct?.size || '80g'}
                    placeholder="e.g. 80g, 35g, 6ml"
                    className="w-full bg-brand-black border border-brand-gray rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || 'Creams'}
                    className="w-full bg-brand-black border border-brand-gray rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-yellow"
                  >
                    <option value="Creams">Creams</option>
                    <option value="Fragrances">Fragrances</option>
                    <option value="Lip Care">Lip Care</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Selling Price (₹) *</label>
                  <input
                    name="price"
                    type="number"
                    required
                    defaultValue={editingProduct?.price || 999}
                    className="w-full bg-brand-black border border-brand-gray rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Original MRP (₹)</label>
                  <input
                    name="originalPrice"
                    type="number"
                    defaultValue={editingProduct?.originalPrice || 1499}
                    className="w-full bg-brand-black border border-brand-gray rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Stock Qty</label>
                  <input
                    name="stock"
                    type="number"
                    defaultValue={editingProduct?.stock || 100}
                    className="w-full bg-brand-black border border-brand-gray rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Image Path</label>
                <input
                  name="image"
                  defaultValue={editingProduct?.images[0] || '/images/cream-80g-studio.jpg'}
                  className="w-full bg-brand-black border border-brand-gray rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Short Description</label>
                <input
                  name="shortDescription"
                  defaultValue={editingProduct?.shortDescription || ''}
                  className="w-full bg-brand-black border border-brand-gray rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Full Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProduct?.description || ''}
                  className="w-full bg-brand-black border border-brand-gray rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-brand-gray">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-yellow hover:bg-brand-yellow-dark text-black font-extrabold px-6 py-2 rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
