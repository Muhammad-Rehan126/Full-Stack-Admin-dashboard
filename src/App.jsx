import { useEffect, useState } from 'react';
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
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    API.get('/auth/me')
      .then(({ data }) => {
        if (isMounted) setUser(data.user);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setIsCheckingSession(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300" aria-live="polite">
        Checking your session…
      </main>
    );
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
