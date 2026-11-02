import React, { useState } from 'react';
import { LayoutDashboard, Users, Package, ShoppingCart, Settings, LogOut, Menu, X } from 'lucide-react';

export default function MainLayout({ children, activePage, setActivePage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer Products', icon: Users },
    { id: 'manage', label: 'Manage Products', icon: Package },
    { id: 'sales', label: 'Product Sales', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex overflow-x-hidden">
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 transform transition-transform duration-300 flex flex-col justify-between ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div>
          <div className="p-5 flex items-center justify-between border-b border-slate-800">
            <h1 className="text-base font-extrabold tracking-wider text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span> BERRY
            </h1>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <nav className="p-3 space-y-1 text-xs font-bold">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (setActivePage) {
                      setActivePage(item.id);
                    }
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  <IconComponent size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-800">
          <button 
            onClick={() => alert('Logged out successfully!')}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-rose-500/10 text-rose-500 text-xs font-bold transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <Menu size={20} />
            </button>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Control Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}