import { useState } from 'react';
import MobileNav from './MobileNav';
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
  ShoppingCart,
  Download,
  X,
  Trash2,
  RefreshCw,
  User,
  Plus,
  Minus
} from 'lucide-react';

// 12 Images Imports for Vite
import img1 from '../assets/img-1.png';
import img2 from '../assets/img-2.png';
import img3 from '../assets/img-3.png';
import img4 from '../assets/img-4.png';
import img5 from '../assets/img-5.png';
import img6 from '../assets/img-6.png';
import img7 from '../assets/img-7.png';
import img8 from '../assets/img-8.png';
import img9 from '../assets/img-9.png';
import img10 from '../assets/img-10.png';
import img11 from '../assets/img-11.png';
import img12 from '../assets/img-12.png';

export default function ProductSales({ activePage, setActivePage, onLogout }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [usernameInput, setUsernameInput] = useState('Admin User');
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const initialProducts = [
    { id: 1, name: 'Classic Black T-Shirt', price: 299.99, image: img1 },
    { id: 2, name: 'Premium Leather Jacket', price: 799.99, image: img2 },
    { id: 3, name: 'Sport Running Shoes', price: 199.99, image: img3 },
    { id: 4, name: 'Casual Brown Hoodie', price: 389.99, image: img4 },
    { id: 5, name: 'Vibrant Red Pullover', price: 349.99, image: img5 },
    { id: 6, name: 'Designer Blue Jeans', price: 450.00, image: img6 },
    { id: 7, name: 'Slim Fit Denim Pants', price: 299.00, image: img7 },
    { id: 8, name: 'Urban Explorer Backpack', price: 189.50, image: img8 },
    { id: 9, name: 'Smart Casual Blazer', price: 650.00, image: img9 },
    { id: 10, name: 'Winter Warm Beanie', price: 89.99, image: img10 },
    { id: 11, name: 'Cotton Summer Shorts', price: 149.99, image: img11 },
    { id: 12, name: 'Athletic Training Tracksuit', price: 550.00, image: img12 },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [deletedProducts, setDeletedProducts] = useState([]);
  // Pre-loaded cart items
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Classic Black T-Shirt', price: 299.99, image: img1, qty: 2 }
  ]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setShowCartDrawer(true);
  };

  const handleDeleteProduct = (id) => {
    const itemToDelete = products.find(p => p.id === id);
    if (itemToDelete) {
      setDeletedProducts(prev => [...prev, itemToDelete]);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleRestoreProducts = () => {
    if (deletedProducts.length > 0) {
      setProducts(prev => [...prev, ...deletedProducts]);
      setDeletedProducts([]);
      alert('Tamam deleted cards successfully restore ho gaye hain!');
    } else {
      alert('Restore karne ke liye koi product nahi hai!');
    }
  };

  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleLogout = () => onLogout?.();

  const handleDownloadReport = () => {
    alert('Product sales report successfully download ho gayi hai!');
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCartAmount = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} className="shrink-0" /> },
    { id: 'customers', label: 'Customer Products', icon: <Users size={18} className="shrink-0" /> },
    { id: 'manage', label: 'Manage Products', icon: <Package size={18} className="shrink-0" /> },
    { id: 'sales', label: 'Product Sales', icon: <TrendingUp size={18} className="shrink-0" /> },
  ];

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-800'}`}>

      <MobileNav
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        items={navigationItems}
        activePage={activePage}
        setActivePage={setActivePage}
        darkMode={darkMode}
        onSettings={() => setShowSettingsModal(true)}
        onLogout={handleLogout}
      />
      
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
        <header className={`h-16 border-b flex items-center justify-between px-4 sm:px-6 z-20 gap-3 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden inline-flex size-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/60 cursor-pointer shrink-0" aria-label="Open navigation menu" aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation-drawer">
              <Menu size={20} strokeWidth={2.25} aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 w-full">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search Product Sales..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs sm:text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {deletedProducts.length > 0 && (
              <button 
                onClick={handleRestoreProducts}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md cursor-pointer animate-pulse"
              >
                <RefreshCw size={14} /> Restore ({deletedProducts.length})
              </button>
            )}
            <button 
              onClick={() => setShowCartDrawer(true)}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 relative transition-all cursor-pointer"
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
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 transition-all cursor-pointer"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
            </button>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              U
            </div>
          </div>
        </header>

        {/* PRODUCT SALES CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-20">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">Product Sales - {products.length} Items Available</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {deletedProducts.length > 0 && (
                <button 
                  onClick={handleRestoreProducts}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md cursor-pointer"
                >
                  <RefreshCw size={16} /> Restore Deleted Cards ({deletedProducts.length})
                </button>
              )}
              <button 
                onClick={handleDownloadReport}
                className="flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              >
                <Download size={16} /> Download
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-20 text-slate-400 space-y-3">
                <p className="text-base">Koi product available nahi hai ya sab delete ho chuke hain!</p>
                {deletedProducts.length > 0 && (
                  <button 
                    onClick={handleRestoreProducts}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer"
                  >
                    Click to Restore All Cards
                  </button>
                )}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${darkMode ? 'bg-[#1e293b]/80 border-slate-800 shadow-slate-900/50' : 'bg-white border-slate-200 shadow-sm'}`}
                >
                  <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                    30% OFF
                  </div>

                  {/* Delete Button Icon */}
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-full shadow-md transition-colors cursor-pointer"
                    title="Delete Card"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 line-through mr-2">${(product.price * 1.3).toFixed(2)}</span>
                        <span className="text-sm font-bold text-emerald-500">${product.price.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        className="text-xs text-blue-500 font-semibold hover:underline cursor-pointer"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </main>
      </div>

      {/* SLIDE-OVER CART DRAWER */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowCartDrawer(false)} />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className={`w-screen max-w-md border-l flex flex-col shadow-2xl ${darkMode ? 'bg-[#1e293b] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
              
              <div className="p-5 border-b border-inherit flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <ShoppingCart size={20} className="text-blue-500" /> Shopping Cart ({cartItems.reduce((a, b) => a + b.qty, 0)})
                </h2>
                <button onClick={() => setShowCartDrawer(false)} className="p-1 rounded-lg hover:bg-slate-500/10 text-slate-400 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 space-y-3">
                    <ShoppingCart size={48} className="mx-auto opacity-30" />
                    <p className="text-sm">Aapka cart khaali hai!</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                        <p className="text-xs font-bold text-emerald-500">${item.price.toFixed(2)}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1 rounded bg-slate-500/10 hover:bg-slate-500/20 cursor-pointer">
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold px-2">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1 rounded bg-slate-500/10 hover:bg-slate-500/20 cursor-pointer">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer shrink-0">
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
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('Settings successfully save ho gayi hain!');
                  setShowSettingsModal(false);
                }}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
