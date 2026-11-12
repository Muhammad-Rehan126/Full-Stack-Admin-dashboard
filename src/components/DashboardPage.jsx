import React, { useState, useEffect } from 'react';
import API from '../lib/api';
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
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingBag,
  Users2,
  Activity,
  CheckCircle2,
  X,
  User,
  Minus,
  Trash2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Dashboard({ activePage, setActivePage }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState('Admin User');

  const [reportTitle, setReportTitle] = useState('');
  const [reportValue, setReportValue] = useState('');

  const [stats, setStats] = useState({
    totalSales: '$99,550',
    avgOrderValue: '$802',
    totalLeads: '1,499',
    storeActivity: '98.2%'
  });

  const [revenueData, setRevenueData] = useState([
    { name: 'Jan', sales: 4000, profit: 2400 },
    { name: 'Feb', sales: 3000, profit: 1398 },
    { name: 'Mar', sales: 2000, profit: 9800 },
    { name: 'Apr', sales: 2780, profit: 3908 },
    { name: 'May', sales: 1890, profit: 4800 },
    { name: 'Jun', sales: 2390, profit: 3800 },
  ]);

  const [productSalesData, setProductSalesData] = useState([
    { name: 'Mon', value: 2400 },
    { name: 'Tue', value: 1398 },
    { name: 'Wed', value: 9800 },
    { name: 'Thu', value: 3908 },
    { name: 'Fri', value: 4800 },
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, title: 'New user registered', time: '2 minutes ago', amount: '+1 Member' },
    { id: 2, title: 'Order #4892 completed', time: '15 minutes ago', amount: '$150.00' },
    { id: 3, title: 'Server CPU usage normal', time: '1 hour ago', amount: '42%' },
    { id: 4, title: 'New product added to inventory', time: '3 hours ago', amount: 'Wireless Mouse' },
  ]);

  const topSellingProducts = [
    { name: 'Ergonomic Chair', category: 'Furniture', sales: '1,240 units', revenue: '$37,200', trend: '+12%' },
    { name: 'Wireless Headphones', category: 'Electronics', sales: '980 units', revenue: '$24,500', trend: '+8%' },
    { name: 'Smart Watch Series 7', category: 'Gadgets', sales: '650 units', revenue: '$19,500', trend: '-2%' },
    { name: 'Running Shoes Nike', category: 'Apparel', sales: '510 units', revenue: '$10,200', trend: '+15%' },
  ];

  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Noise-Canceling Headphones', price: 158.50, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60', qty: 1 }
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get('/dashboard');
        if (response.data) {
          setStats({
            totalSales: `$${(response.data.totalSales || 99550).toLocaleString()}`,
            avgOrderValue: `$${response.data.avgOrderValue || 802}`,
            totalLeads: (response.data.totalLeads || 1499).toLocaleString(),
            storeActivity: response.data.storeActivity || '98.2%'
          });
          if (response.data.revenueChart) setRevenueData(response.data.revenueChart);
          if (response.data.productSalesData) setProductSalesData(response.data.productSalesData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const handleAddReportSubmit = (e) => {
    e.preventDefault();
    if (!reportTitle || !reportValue) return;

    const newActivity = {
      id: Date.now(),
      title: reportTitle,
      time: 'Just now',
      amount: reportValue
    };

    setRecentActivities([newActivity, ...recentActivities]);
    setReportTitle('');
    setReportValue('');
    setShowAddReportModal(false);
    alert('Report successfully add ho gayi hai!');
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
      
      {/* SIDEBAR */}
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

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className={`h-16 border-b flex items-center justify-between px-4 sm:px-6 z-10 gap-3 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 cursor-pointer shrink-0" aria-label="Open menu">
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2 w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input type="text" placeholder="Search BERRY..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button onClick={() => setShowCartDrawer(true)} className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 relative cursor-pointer">
              <ShoppingCart size={18} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {cartItems.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 cursor-pointer">
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
            </button>
            <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              U
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Dashboard Overview</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Welcome back, {usernameInput}! Here is what's happening with your store today.</p>
            </div>
            <button 
              onClick={() => setShowAddReportModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer w-full sm:w-auto"
            >
              <Plus size={16} /> Add Report
            </button>
          </div>
          
          {/* STATS CARDS GRID (4 Upper Boxes) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Total Sales', value: stats.totalSales, change: '+12.5%', isUp: true, icon: <DollarSign className="text-blue-500" size={20} /> },
              { title: 'Average Order Value', value: stats.avgOrderValue, change: '+3.2%', isUp: true, icon: <ShoppingBag className="text-emerald-500" size={20} /> },
              { title: 'Total Leads', value: stats.totalLeads, change: '-1.4%', isUp: false, icon: <Users2 className="text-purple-500" size={20} /> },
              { title: 'Store Activity', value: stats.storeActivity, change: '+8.7%', isUp: true, icon: <Activity className="text-amber-500" size={20} /> },
            ].map((stat, idx) => (
              <div key={idx} className={`p-4 sm:p-5 rounded-2xl border ${darkMode ? 'bg-[#1e293b]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.title}</p>
                  <div className={`p-2 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>{stat.icon}</div>
                </div>
                <div className="flex items-baseline justify-between mt-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold">{stat.value}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${stat.isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-[#1e293b]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="font-bold text-base mb-4">Revenue & Profit Breakdown</h3>
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} />
                    <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', borderRadius: '12px' }} />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-[#1e293b]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="font-bold text-base mb-4">Product Sales Flow</h3>
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productSalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} />
                    <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* LOWER SECTION: ACTIVITY & PRODUCTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-[#1e293b]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="font-bold text-base flex items-center gap-2 mb-4">
                <Activity size={18} className="text-blue-500" /> Live Store Activity
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((act) => (
                  <div key={act.id} className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between gap-2 ${darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${darkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold truncate">{act.title}</h4>
                        <p className="text-[11px] text-slate-400">{act.time}</p>
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 shrink-0">
                      {act.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-4 sm:p-6 rounded-2xl border ${darkMode ? 'bg-[#1e293b]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="font-bold text-base flex items-center gap-2 mb-4">
                <ShoppingBag size={18} className="text-emerald-500" /> Top Performing Products
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[400px]">
                  <thead>
                    <tr className={`border-b text-xs uppercase tracking-wider ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                      <th className="pb-3 font-semibold">Product Name</th>
                      <th className="pb-3 font-semibold">Sales</th>
                      <th className="pb-3 font-semibold">Revenue</th>
                      <th className="pb-3 text-right font-semibold">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-inherit">
                    {topSellingProducts.map((prod, idx) => (
                      <tr key={idx} className={darkMode ? 'border-slate-800' : 'border-slate-100'}>
                        <td className="py-3 font-medium">
                          {prod.name}
                          <span className="block text-xs text-slate-400 font-normal">{prod.category}</span>
                        </td>
                        <td className="py-3 text-xs font-semibold text-slate-300">{prod.sales}</td>
                        <td className="py-3 font-bold text-emerald-500">{prod.revenue}</td>
                        <td className="py-3 text-right">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${prod.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {prod.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ADD REPORT MODAL */}
      {showAddReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleAddReportSubmit} className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 ${darkMode ? 'bg-[#1e293b] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
            <div className="flex items-center justify-between border-b pb-3 border-inherit">
              <h3 className="text-lg font-bold">Add New Store Report</h3>
              <button type="button" onClick={() => setShowAddReportModal(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Report Title / Activity</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. New Order Dispatched"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Amount / Value</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. $350.00 or +2 Members"
                  value={reportValue}
                  onChange={(e) => setReportValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-inherit">
              <button type="button" onClick={() => setShowAddReportModal(false)} className="px-4 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 cursor-pointer">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl text-sm bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 cursor-pointer">
                Save Report
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SHOPPING CART SLIDE-OVER DRAWER */}
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

              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
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
                          <button onClick={() => updateCartQty(item.id, -1)} className="p-1 rounded bg-slate-500/10 hover:bg-slate-500/20 cursor-pointer">
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold px-2">{item.qty}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} className="p-1 rounded bg-slate-500/10 hover:bg-slate-500/20 cursor-pointer">
                            <Plus size={12} />
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