
 const handleCheckout = () => {
    if (cart.length === 0) return;
    setOrderPlaced(true);
    setCart([]);
    setTimeout(() => setOrderPlaced(false), 4000);
  };{isAdminMode ? (
  /* --- UPGRADED ADMIN PANEL VIEW --- */
  <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 max-w-2xl mx-auto">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-black text-slate-800 tracking-tight">Add New Product</h2>
      <p className="text-slate-500 mt-2 font-medium">The data entered here goes directly to your MongoDB database.</p>
    </div>
    
    <form className="space-y-6" onSubmit={handleUpload}>
      
      {/* 1. STACKED NAME GROUP */}
      <div className="flex flex-col gap-2"> 
        <label className="text-sm font-bold uppercase text-slate-500 ml-1">
          Product Name
        </label>
        <input 
          type="text" 
          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all" 
          value={newProduct.name}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
          placeholder="e.g. Pro Gaming Mouse" 
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. STACKED PRICE GROUP */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase text-slate-500 ml-1">
            Price ($)
          </label>
          <input 
            type="number" 
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all" 
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            placeholder="0.00" 
            required
          />
        </div>

        {/* 3. STACKED CATEGORY GROUP */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase text-slate-500 ml-1">
            Category
          </label>
          <input 
            type="text" 
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all" 
            value={newProduct.category}
            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
            placeholder="Electronics" 
            required
          />
        </div>
      </div>

      {/* 4. STACKED IMAGE URL GROUP */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase text-slate-500 ml-1">
          Image URL
        </label>
        <input 
          type="text" 
          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-mono text-sm" 
          value={newProduct.imageUrl}
          onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
          placeholder="https://images.unsplash.com/..." 
          required
        />
      </div>
      {/* 1. Add this inside your <form> before the <button> */}
<div className="mt-4">
  {newProduct.name === '' ? (
    <p className="text-amber-600 text-sm font-medium animate-pulse">
      ⚠️ Please enter a product name to continue.
    </p>
  ) : (
    <p className="text-emerald-600 text-sm font-medium">
      ✅ Looking good! Ready to upload.
    </p>
  )}
</div>

{/* 2. The Button */}
      <button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl transition-all mt-4"
      >
        UPLOAD TO STORE
      </button>
    </form>
  </div>
) : (
 
  













  import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, CheckCircle, Trash2 } from 'lucide-react';

// 1. Interfaces
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category?: string;
}
interface CartItem extends Product {
  quantity: number;
}
interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price?: number; 
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}
function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
const [adminTab, setAdminTab] = useState<'products' | 'orders'>('products'); 
  // Form State for Admin Panel
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    imageUrl: ''
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('myCart');
    return saved ? JSON.parse(saved) : [];
  });
  // Persist Cart
  useEffect(() => {
    localStorage.setItem('myCart', JSON.stringify(cart));
  }, [cart]);

  // Fetch Products on Load
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Backend not running?", err));
  }, []);

  // --- LOGIC FUNCTIONS ---

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

const handleCheckout = async () => {
    try {
      // 1. Calculate the total price of everything in the cart
      const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

      // 2. Package the data to send to the backend
      const orderData = {
        items: cart,
        totalAmount: totalAmount
      };

      // 3. Send the data to your Node.js backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      // 4. If the backend successfully saves the data
      if (response.ok) {
        console.log("Order saved to database:", data);
        setOrderPlaced(true); // Shows your success message
        setCart([]); // Clears the cart
      } else {
        console.error("Failed to save order:", data);
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("There was an error connecting to the server.");
    }
  }; // <--- THIS is the closing bracket that was missing!

  // The missing function that handles the "Upload to Store" button
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        // 1. Add new product to the current list
        setProducts([...products, addedProduct]); 
        // 2. Switch back to shop view automatically
        setIsAdminMode(false); 
        // 3. Reset form
        setNewProduct({ name: '', price: '', category: '', imageUrl: '' });
      } else {
        alert("Failed to save product. Check backend terminal.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Backend server is not responding!");
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER WITH TOGGLE BUTTON */}
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black text-blue-600 tracking-tighter italic">TECH_STORE</h1>
          <button 
            onClick={() => setIsAdminMode(!isAdminMode)}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2"
          >
            {isAdminMode ? "Back to Shop" : "Open Admin Panel"}
          </button>
          <input type="text" name="search" placeholder = "i dint know" className='bg-red-500 font-black p-4 m-4'/>
        </header>
{isAdminMode ? (
  /* --- UPGRADED ADMIN PANEL VIEW --- */
  <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 max-w-5xl mx-auto">
    
    {/* Admin Navigation */}
    <div className="flex justify-center gap-4 mb-8 border-b pb-4">
      <button 
        onClick={() => setAdminTab('products')}
        className={`px-6 py-2 rounded-xl font-bold transition-all ${adminTab === 'products' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
      >
        Add Products
      </button>
      <button 
        onClick={() => setAdminTab('orders')}
        className={`px-6 py-2 rounded-xl font-bold transition-all ${adminTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
      >
        Manage Orders
      </button>
    </div>

    {adminTab === 'products' ? (
      /* YOUR EXISTING ADD PRODUCT FORM GOES HERE */
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Add New Product</h2>
          <p className="text-slate-500 mt-2 font-medium">The data entered here goes directly to your MongoDB database.</p>
        </div>
        {/* Paste your exact <form className="space-y-6" onSubmit={handleUpload}>... </form> here */}
      </div>
    ) : (
      /* NEW: ORDER MANAGEMENT DASHBOARD */
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 rounded-tl-xl">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4 rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-slate-400">No orders found.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500">{order._id.slice(-6)}...</td>
                    <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-slate-600">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="p-4 font-bold">${order.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`p-2 rounded-lg font-bold text-sm outline-none border cursor-pointer
                          ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : ''}
                          ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                          ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : ''}
                        `}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
) : (
  /* ... Your existing Shop View ... */
    /* --- SHOP VIEW --- */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Product List & Search Bar would go here */}
              <div className="lg:col-span-2">
                <div className="relative mb-8">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product._id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                       <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-48 object-cover rounded-2xl mb-4" />
                       <h3 className="font-bold text-lg">{product.name}</h3>
                       <p className="text-blue-600 font-black text-xl">${product.price}</p>
                       <button 
                        onClick={() => addToCart(product)}
                        className="mt-4 w-full bg-slate-900 text-white py-2 rounded-xl hover:bg-blue-600 transition-colors"
                       >
                         Add to Cart
                       </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Section */}
              <div className="bg-white p-6 rounded-3xl shadow-xl h-fit sticky top-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShoppingCart /> Your Cart
                </h2>
                {cart.length === 0 ? (
                  <p className="text-slate-400">Cart is empty</p>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item._id} className="flex justify-between items-center mb-4 pb-4 border-b border-slate-50">
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-sm text-slate-500">${item.price} x {item.quantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <div className="mt-6">
                      <div className="flex justify-between font-bold text-xl mb-4">
                        <span>Total:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={handleCheckout}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg"
                      >
                        Checkout Now
                      </button>
                    </div>
                  </>
                )}
                {orderPlaced && (
                  <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2">
                    <CheckCircle size={20} /> Order placed successfully!
                  </div>
                )}
              </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;














