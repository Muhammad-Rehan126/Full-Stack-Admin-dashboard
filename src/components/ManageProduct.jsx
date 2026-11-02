import React, { useState, useEffect } from 'react';
import API from '../lib/api';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Search, 
  Sun, 
  Moon, 
  Menu,
  Plus,
  X,
  User,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Trash2
} from 'lucide-react';

// Images Imports for Vite (img13 to img18)
import img13 from '../assets/img-13.png';
import img14 from '../assets/img-14.png';
import img15 from '../assets/img-15.png';
import img16 from '../assets/img-16.png';
import img17 from '../assets/img-17.png';
import img18 from '../assets/img-18.png';

export default function ManageProductsPage({ activePage, setActivePage }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [usernameInput, setUsernameInput] = useState('Admin User');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Products with specific images (img13 to img18 mapped across pages)
  const dummyProducts = [
    { id: 1, name: 'Noise-Canceling Headphones', sku: 'SKU-001', category: 'Electronics', stock: 25, price: 158.50, status: 'Active', image: img13 },
    { id: 2, name: 'Slim-Fit Cotton T-shirt', sku: 'SKU-002', category: 'Apparel', stock: 50, price: 193.90, status: 'Active', image: img14 },
    { id: 3, name: 'Leather Backpack', sku: 'SKU-003', category: 'Accessories', stock: 15, price: 123.50, status: 'Active', image: img15 },
    { id: 4, name: 'Smart Fitness Watch', sku: 'SKU-004', category: 'Gadgets', stock: 10, price: 299.50, status: 'Active', image: img16 },
    { id: 5, name: 'Ergonomic Office Chair', sku: 'SKU-005', category: 'Furniture', stock: 8, price: 399.99, status: 'Active', image: img17 },
    { id: 6, name: 'Minimalist Leather Wallet', sku: 'SKU-006', category: 'Accessories', stock: 30, price: 49.50, status: 'Active', image: img18 },
  ];

  const [productsData, setProductsData] = useState(dummyProducts);
  const [loading, setLoading] = useState(false);

  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Noise-Canceling Headphones', price: 158.50, image: img13, qty: 1 }
  ]);

  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodImage, setProdImage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        if (response.data && response.data.length > 0) {
          setProductsData(response.data);
        }
      } catch (error) {
        console.error("Backend offline, using local products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!prodName || !prodSku) return;

    const newProd = {
      id: Date.now(),
      name: prodName,
      sku: prodSku,
      category: 'General',
      stock: prodStock ? parseInt(prodStock) : 10,
      price: prodPrice ? parseFloat(prodPrice) : 100.00,
      status: 'Active',
      image: prodImage || img13
    };

    try {
      const response = await API.post('/products', newProd);
      setProductsData([response.data || newProd, ...productsData]);
    } catch (error) {
      setProductsData([newProd, ...productsData]);
    }

    setProdName('');
    setProdSku('');
    setProdPrice('');
    setProdStock('');
    setProdImage('');
    setShowNewProductModal(false);
    alert('Product successfully add ho gaya hai!');
  };

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id || item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => 
          (item._id === product._id || item.id === product.id) ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevItems, { id: product._id || product.id, name: product.name, price: product.price, image: product.image || img13, qty: 1 }];
    });
    setShowCartDrawer(true);
  };

  const updateCartQty = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeCartItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleLogout = () => {
    alert('Aap successfully logout ho chuke hain!');
  };

  const filteredProducts = productsData.filter(prod => 
    prod.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    prod.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalCartAmount = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} className="shrink-0" /> },
    { id: 'customers', label: 'Customer Products', icon: <Users size={18} className="shrink-0" /> },
    { id: 'manage', label: 'Manage Products', icon: <Package size={18} className="shrink-0" /> },
    { id: 'sales', label: 'Product Sales', icon: <TrendingUp size={18} className="shrink-0" /> },
  ];

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`hidden md:flex ${sidebarOpen ? 'w-64' : 'w-20'} border-r flex-col transition-all duration-300 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="p-5 flex items-center justify-between border-b border-inherit">
          {sidebarOpen && <h1 className="text-xl font-extrabold tracking-wider text-blue-600">BERRY</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-slate-500/10 ml-auto cursor-pointer">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navigationItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActivePage && setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${activePage === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-slate-500/10 text-slate-500 dark:text-slate-400'}`}
            >
              {item.icon}
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-inherit space-y-1">
          <button onClick={() => setShowSettingsModal(true)} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-500/10 text-slate-500 dark:text-slate-400 cursor-pointer">
            <Settings size={18} className="shrink-0" /> {sidebarOpen && <span className="truncate">Settings</span>}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-500/10 text-rose-500 cursor-pointer">
            <LogOut size={18} className="shrink-0" /> {sidebarOpen && <span className="truncate">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className={`h-16 border-b flex items-center justify-between px-3 sm:px-6 z-10 gap-2 sm:gap-4 shrink-0 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 w-full">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs sm:text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setShowCartDrawer(true)}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 relative cursor-pointer"
            >
              <ShoppingCart size={18} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {cartItems.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 cursor-pointer"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
            </button>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              U
            </div>
          </div>
        </header>

        {/* MANAGE PRODUCTS CONTENT */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 pb-20">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <h1 className="text-base sm:text-xl font-bold tracking-tight">Products Inventory - {filteredProducts.length} Total Items</h1>
            <button 
              onClick={() => setShowNewProductModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 cursor-pointer w-full sm:w-auto"
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>

          {/* Products Table */}
          <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-[#1e293b]/60 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className={`border-b text-xs uppercase tracking-wider ${darkMode ? 'border-slate-800 text-slate-400 bg-slate-900/40' : 'border-slate-200 text-slate-500 bg-slate-50/50'}`}>
                    <th className="p-4 font-semibold">Product Image</th>
                    <th className="p-4 font-semibold">Product Name</th>
                    <th className="p-4 font-semibold">SKU</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Stock Level</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-inherit">
                  {currentProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-10 text-slate-400">No products found.</td>
                    </tr>
                  ) : (
                    currentProducts.map((prod) => (
                      <tr key={prod._id || prod.id} className={`transition-colors ${darkMode ? 'hover:bg-slate-800/40 border-slate-800' : 'hover:bg-slate-50 border-slate-100'}`}>
                        <td className="p-4">
                          <img 
                            src={prod.image || img13} 
                            alt={prod.name} 
                            className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0" 
                          />
                        </td>
                        <td className="p-4 font-medium">{prod.name}</td>
                        <td className="p-4 text-xs font-mono text-slate-400">{prod.sku}</td>
                        <td className="p-4 text-xs text-slate-400">{prod.category || 'General'}</td>
                        <td className="p-4 text-xs font-semibold">{prod.stock}</td>
                        <td className="p-4 font-bold text-emerald-500">${prod.price?.toFixed(2)}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 text-xs rounded-full font-bold inline-block bg-emerald-500/10 text-emerald-500">
                            {prod.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleAddToCart(prod)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
              <span>Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} entries</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 disabled:opacity-50 cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 disabled:opacity-50 cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* SHOPPING CART DRAWER */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowCartDrawer(false)} />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className={`w-screen max-w-md border-l flex flex-col shadow-2xl ${darkMode ? 'bg-[#1e293b] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
              
              <div className="p-5 border-b border-inherit flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <ShoppingCart size={20} className="text-blue-500" /> Shopping Cart ({cartItems.reduce((a, b) => a + b.qty, 0)})
                </h2>
                <button onClick={() => setShowCartDrawer(false)} className="p-1 rounded-lg hover:bg-slate-500/10 text-slate-400 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 space-y-3">
                    <ShoppingCart size={48} className="mx-auto opacity-30" />
                    <p className="text-sm">Aapka cart khaali hai!</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                        <p className="text-xs font-bold text-emerald-500">${item.price.toFixed(2)}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateCartQty(item.id, -1)} className="p-1 rounded bg-slate-500/10 hover:bg-slate-500/20 cursor-pointer">
                            -
                          </button>
                          <span className="text-xs font-bold px-2">{item.qty}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} className="p-1 rounded bg-slate-500/10 hover:bg-slate-500/20 cursor-pointer">
                            +
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeCartItem(item.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-5 border-t border-inherit space-y-3">
                  <div className="flex items-center justify-between text-base font-bold">
                    <span>Total Amount:</span>
                    <span className="text-emerald-500">${totalCartAmount.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      alert('Aapka order successfully place ho gaya hai!');
                      setCartItems([]);
                      setShowCartDrawer(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {showNewProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
          <form onSubmit={handleAddProduct} className={`w-full max-w-md rounded-2xl border shadow-2xl p-4 sm:p-6 space-y-4 my-auto ${darkMode ? 'bg-[#1e293b] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
            <div className="flex items-center justify-between border-b pb-3 border-inherit">
              <h3 className="text-lg font-bold">Add New Product</h3>
              <button type="button" onClick={() => setShowNewProductModal(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Wireless Mouse"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">SKU</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SKU-9988"
                  value={prodSku}
                  onChange={(e) => setProdSku(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="150"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Stock Level</label>
                  <input 
                    type="number" 
                    placeholder="25"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t border-inherit">
              <button 
                type="button" 
                onClick={() => setShowNewProductModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-6 ${darkMode ? 'bg-[#1e293b] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
            <div className="flex items-center justify-between border-b pb-4 border-inherit">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Settings size={20} className="text-blue-500" /> Dashboard Settings
              </h2>
              <button onClick={() => setShowSettingsModal(false)} className="p-1.5 rounded-lg hover:bg-slate-500/10 text-slate-400 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Admin Username</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <User size={16} className="text-slate-400 shrink-0" />
                  <input 
                    type="text" 
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-inherit">
              <button onClick={() => setShowSettingsModal(false)} className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 cursor-pointer">
                Cancel
              </button>
              <button onClick={() => { alert('Settings successfully save ho gayi hain!'); setShowSettingsModal(false); }} className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-md cursor-pointer">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}