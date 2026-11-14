import { lazy, Suspense, useState } from 'react';
import API from './lib/api';

const CustomerProductsPage = lazy(() => import('./components/CustomerProducts'));
const Dashboard = lazy(() => import('./components/DashboardPage'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const ManageProductsPage = lazy(() => import('./components/ManageProduct'));
const ProductSalesPage = lazy(() => import('./components/ProductSales'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));

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

  const pageProps = { activePage, setActivePage, onLogout: handleLogout };
  let ActivePage = LoginPage;

  if (user) {
    switch (activePage) {
      case 'customers':
        ActivePage = CustomerProductsPage;
        break;
      case 'manage':
        ActivePage = ManageProductsPage;
        break;
      case 'sales':
        ActivePage = ProductSalesPage;
        break;
      case 'settings':
        ActivePage = SettingsPage;
        break;
      default:
        ActivePage = Dashboard;
    }
  }

  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center text-sm text-slate-500" aria-busy="true">Loading workspace…</main>}>
      {user
        ? <ActivePage {...pageProps} />
        : <ActivePage onLogin={setUser} />}
    </Suspense>
  );
}
