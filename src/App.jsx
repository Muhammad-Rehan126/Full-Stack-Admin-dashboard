import React, { useState } from 'react';
import Dashboard from './components/DashboardPage';
import CustomerProductsPage from './components/CustomerProducts';
import ManageProductsPage from './components/ManageProduct';
import ProductSalesPage from './components/ProductSales';
import SettingsPage from './components/SettingsPage';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard activePage={activePage} setActivePage={setActivePage} />;
      case 'customers':
        return <CustomerProductsPage activePage={activePage} setActivePage={setActivePage} />;
      case 'manage':
        return <ManageProductsPage activePage={activePage} setActivePage={setActivePage} />;
      case 'sales':
        return <ProductSalesPage activePage={activePage} setActivePage={setActivePage} />;
      case 'settings':
        return <SettingsPage activePage={activePage} setActivePage={setActivePage} />;
      default:
        return <Dashboard activePage={activePage} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-50 text-slate-800">
      {renderPage()}
    </div>
  );
}