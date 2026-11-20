import { lazy, Suspense, useState } from 'react';
import useSWR from 'swr';
import API from './lib/api';

const CustomerProductsPage = lazy(() => import('./components/CustomerProducts'));
const Dashboard = lazy(() => import('./components/DashboardPage'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const ManageProductsPage = lazy(() => import('./components/ManageProduct'));
const ProductSalesPage = lazy(() => import('./components/ProductSales'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
const PAGE_NAMES = new Set(['dashboard', 'customers', 'manage', 'sales', 'settings']);

const fetcher = async (path) => {
  const { data } = await API.get(path);
  return data;
};

function getInitialPage() {
  const page = window.location.hash.slice(1);
  return PAGE_NAMES.has(page) ? page : 'dashboard';
}

export default function App() {
  const [activePage, setActivePageState] = useState(getInitialPage);
  const { data: session, error: sessionError, isLoading, mutate } = useSWR('/auth/me', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
  const user = session?.user ?? null;

  function setActivePage(page) {
    const nextPage = PAGE_NAMES.has(page) ? page : 'dashboard';
    setActivePageState(nextPage);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${nextPage}`);
  }

  async function handleLogout() {
    try {
      await API.post('/auth/logout');
    } catch {
      // Remove the local session view even when the API is temporarily unreachable.
    } finally {
      await mutate(null, { revalidate: false });
      setActivePage('dashboard');
    }
  }

  function handleLogin(loggedInUser) {
    void mutate({ user: loggedInUser }, { revalidate: false });
  }

  if (isLoading && !sessionError) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-slate-500" aria-busy="true">Checking session…</main>;
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
        : <ActivePage onLogin={handleLogin} />}
    </Suspense>
  );
}
