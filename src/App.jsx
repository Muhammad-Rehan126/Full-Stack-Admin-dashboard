import { lazy, Suspense, useState } from 'react';
import useSWR from 'swr';
import LoginPage from './components/LoginPage';
import API from './lib/api';

const CustomerProductsPage = lazy(() => import('./components/CustomerProducts'));
const Dashboard = lazy(() => import('./components/DashboardPage'));
const ManageProductsPage = lazy(() => import('./components/ManageProduct'));
const ProductSalesPage = lazy(() => import('./components/ProductSales'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
const PAGE_NAMES = new Set(['dashboard', 'customers', 'manage', 'sales', 'settings']);
const SESSION_HINT_KEY = 'admin-session-hint';

function setSessionHint(isAuthenticated) {
  try {
    if (isAuthenticated) {
      window.sessionStorage.setItem(SESSION_HINT_KEY, '1');
    } else {
      window.sessionStorage.removeItem(SESSION_HINT_KEY);
    }
  } catch {
    // The server cookie remains the source of truth if session storage is unavailable.
  }
}

function getSessionHint() {
  try {
    return window.sessionStorage.getItem(SESSION_HINT_KEY) === '1' ? { user: {} } : null;
  } catch {
    return null;
  }
}

const fetcher = async (path) => {
  try {
    const { data } = await API.get(path);
    setSessionHint(true);
    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      setSessionHint(false);
      return null;
    }
    throw error;
  }
};

function getInitialPage() {
  const page = window.location.hash.slice(1);
  return PAGE_NAMES.has(page) ? page : 'dashboard';
}

export default function App() {
  const [activePage, setActivePageState] = useState(getInitialPage);
  const { data: session, mutate } = useSWR('/auth/me', fetcher, {
    fallbackData: getSessionHint(),
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
      setSessionHint(false);
      await mutate(null, { revalidate: false });
      setActivePage('dashboard');
    }
  }

  function handleLogin(loggedInUser) {
    setSessionHint(true);
    void mutate({ user: loggedInUser }, { revalidate: false });
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
