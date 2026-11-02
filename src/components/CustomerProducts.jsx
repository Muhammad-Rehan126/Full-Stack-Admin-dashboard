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
  ShoppingCart,
  Filter,
  MoreHorizontal,
  X,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';

export default function CustomerProductsPage({ activePage, setActivePage }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [usernameInput, setUsernameInput] = useState('Admin User');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('All');

  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Noise-Canceling Headphones', price: 158.50, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60', qty: 1 }
  ]);

  // Default rich dummy customers list taake page kabhi khali na ho
  const dummyCustomers = [
    { name: 'Alice Johnson', email: 'alice.johnson@gmail.com', lastOrder: '1.33%', spent: '$69.00', segment: 'Customer Segment', status: 'Active' },
    { name: 'Bob Smith', email: 'bob.smith@gmail.com', lastOrder: '16.4%', spent: '$1,273.00', segment: 'Customer Segment', status: 'Active' },
    { name: 'Catherine Davis', email: 'catherine.davis@gmail.com', lastOrder: '10.1%', spent: '$1,173.00', segment: 'Customer Segment', status: 'Active' },
    { name: 'Bob Smith', email: 'bobsmith@store.com', lastOrder: '26.8%', spent: '$293.00', segment: 'Customer Segment', status: 'Active' },
    { name: 'Catherine Davis', email: 'cath.davis@gmail.com', lastOrder: '14.7%', spent: '$1,135.00', segment: 'Customer Segment', status: 'Active' },
    { name: 'Liepe Smith', email: 'liepe.smith@gmail.com', lastOrder: '16.2%', spent: '$143.00', segment: 'Customer Segment', status: 'Active' },
    { name: 'Bob Smith', email: 'bob.admin@gmail.com', lastOrder: '18.7%', spent: '$230.00', segment: 'Customer Segment', status: 'Confirmed' },
    { name: 'Alice Johnson', email: 'alice.store@gmail.com', lastOrder: '8.20%', spent: '$461.00', segment: 'Customer Segment', status: 'Confirmed' }
  ];

  const [customersData, setCustomersData] = useState(dummyCustomers);
  const [loading, setLoading] = useState(false);

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustSpent, setNewCustSpent] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await API.get('/customers');
        if (response.data && response.data.length > 0) {
          setCustomersData(response.data);
        }
      } catch (error) {
        console.error("Backend offline, using local dummy data:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustName || !newCustEmail) return;

    const newEntry = {
      name: newCustName,
      email: newCustEmail,
      lastOrder: '0.0%',
      spent: newCustSpent ? `$${newCustSpent}` : '$0.00',
      segment: 'Customer Segment',
      status: 'Active'
    };

    try {
      const response = await API.post('/customers', newEntry);
      setCustomersData([response.data || newEntry, ...customersData]);
    } catch (error) {
      setCustomersData([newEntry, ...customersData]);
    }
    
    setNewCustName('');
    setNewCustEmail('');
    setNewCustSpent('');
    setShowNewCustomerModal(false);
    alert('Naya customer successfully add ho gaya hai!');
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

  const filteredCustomers = customersData.filter(cust => {
    const matchesSearch = cust.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cust.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = selectedSegment === 'All' || cust.segment === selectedSegment;
    return matchesSearch && matchesSegment;
  });

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
                placeholder="Search customers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs sm:text-sm w-full min-w-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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

        {/* CUSTOMER PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 pb-20">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <h1 className="text-base sm:text-xl font-bold tracking-tight">Customers - {filteredCustomers.length + 15200} Total</h1>
            <button 
              onClick={() => setShowNewCustomerModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer w-full sm:w-auto"
            >
              <Plus size={16} /> New Customer
            </button>
          </div>

          {/* Filter Bar */}
          <div className={`p-3 sm:p-4 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${darkMode ? 'bg-[#1e293b]/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Filter size={15} />
              <span>Filter by Segment: <strong className="text-slate-200">{selectedSegment}</strong></span>
            </div>
            <div className="w-full sm:w-48">
              <select 
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-xs outline-none cursor-pointer"
              >
                <option value="All" className="dark:bg-slate-900">All Segments</option>
                <option value="Customer Segment" className="dark:bg-slate-900">Customer Segment</option>
              </select>
            </div>
          </div>

          {/* Customers Table Container */}
          <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-[#1e293b]/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className={`border-b text-xs uppercase tracking-wider ${darkMode ? 'border-slate-800 text-slate-400 bg-slate-900/40' : 'border-slate-200 text-slate-500 bg-slate-50/50'}`}>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Last Order</th>
                    <th className="p-4 font-semibold">Total Spent</th>
                    <th className="p-4 font-semibold">Customer Segment</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-inherit">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-slate-400">No customers found matching your search.</td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust, idx) => (
                      <tr key={cust._id || idx} className={`transition-colors ${darkMode ? 'hover:bg-slate-800/40 border-slate-800' : 'hover:bg-slate-50 border-slate-100'}`}>
                        <td className="p-4 font-medium">{cust.name}</td>
                        <td className="p-4 text-slate-400 text-xs">{cust.email}</td>
                        <td className="p-4 text-xs font-semibold">{cust.lastOrder}</td>
                        <td className="p-4 font-bold text-blue-500">{cust.spent}</td>
                        <td className="p-4 text-xs text-slate-400">{cust.segment}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 text-xs rounded-full font-bold inline-block bg-emerald-500/10 text-emerald-500">
                            {cust.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button className="p-1.5 rounded-lg hover:bg-slate-500/10 text-slate-400 inline-flex items-center justify-center cursor-pointer">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* NEW CUSTOMER MODAL */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
          <form onSubmit={handleAddCustomer} className={`w-full max-w-md rounded-2xl border shadow-2xl p-4 sm:p-6 space-y-4 my-auto ${darkMode ? 'bg-[#1e293b] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
            <div className="flex items-center justify-between border-b pb-3 border-inherit">
              <h3 className="text-base sm:text-lg font-bold">Add New Customer</h3>
              <button type="button" onClick={() => setShowNewCustomerModal(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. john@gmail.com"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Total Spent ($)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 500"
                  value={newCustSpent}
                  onChange={(e) => setNewCustSpent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t border-inherit">
              <button 
                type="button" 
                onClick={() => setShowNewCustomerModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-500/10 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Save Customer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-4 sm:p-6 space-y-6 my-auto ${darkMode ? 'bg-[#1e293b] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
            <div className="flex items-center justify-between border-b pb-4 border-inherit">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <Settings size={18} className="text-blue-500" /> Dashboard Settings
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
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-inherit">
              <button onClick={() => setShowSettingsModal(false)} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 cursor-pointer">
                Cancel
              </button>
              <button onClick={() => { alert('Settings successfully save ho gayi hain!'); setShowSettingsModal(false); }} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-md cursor-pointer">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}