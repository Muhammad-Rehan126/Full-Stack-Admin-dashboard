import { Settings, LogOut, X } from 'lucide-react';

// Slide-in navigation drawer for screens below the md breakpoint.
export default function MobileNav({ open, onClose, items, activePage, setActivePage, darkMode, onSettings, onLogout }) {
  const go = (id) => {
    if (setActivePage) setActivePage(id);
    onClose();
  };

  return (
    <div className={`md:hidden fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open} inert={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`absolute inset-y-0 left-0 w-64 max-w-[80vw] flex flex-col border-r transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} ${darkMode ? 'bg-[#1e293b] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
      >
        <div className="p-5 flex items-center justify-between border-b border-inherit">
          <h1 className="text-xl font-extrabold tracking-wider text-blue-600">BERRY</h1>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-500/10 cursor-pointer" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${activePage === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-slate-500/10 text-slate-500 dark:text-slate-400'}`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-inherit space-y-1">
          {onSettings && (
            <button onClick={() => { onClose(); onSettings(); }} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-500/10 text-slate-500 dark:text-slate-400 cursor-pointer">
              <Settings size={18} className="shrink-0" /> Settings
            </button>
          )}
          {onLogout && (
            <button onClick={() => { onClose(); onLogout(); }} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-500/10 text-rose-500 cursor-pointer">
              <LogOut size={18} className="shrink-0" /> Logout
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
