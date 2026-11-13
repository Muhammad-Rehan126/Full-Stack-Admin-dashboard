import { useState } from 'react';
import API from './lib/api';
import CustomerProductsPage from './components/CustomerProducts';
import Dashboard from './components/DashboardPage';
import LoginPage from './components/LoginPage';
import ManageProductsPage from './components/ManageProduct';
import ProductSalesPage from './components/ProductSales';
import SettingsPage from './components/SettingsPage';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState(null);

  async function handleLogout() {
    try {
      await API.post('/auth/logout');
    } catch {
      // Remove the local session view even when the API is temporarily unreachable.
    } finally {
      setUser(null);
      setActivePage('dashboard');
    }
  }

  if (!user) return <LoginPage onLogin={setUser} />;

  const pageProps = { activePage, setActivePage, onLogout: handleLogout };

  switch (activePage) {
    case 'customers':
      return <CustomerProductsPage {...pageProps} />;
    case 'manage':
      return <ManageProductsPage {...pageProps} />;
    case 'sales':
      return <ProductSalesPage {...pageProps} />;
    case 'settings':
      return <SettingsPage {...pageProps} />;
    default:
      return <Dashboard {...pageProps} />;
  }
}
