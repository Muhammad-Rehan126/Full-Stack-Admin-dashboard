import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CheckCircle } from 'lucide-react';

export default function CartPage({ cartItems, setCartItems, setActivePage }) {
  const [loading, setLoading] = useState(false);

  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalCartAmount = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      alert('Aapka order successfully place ho gaya hai!');
      setCartItems([]);
      setLoading(false);
      if (setActivePage) setActivePage('dashboard');
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header & Back Button */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActivePage && setActivePage('dashboard')}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="text-blue-500" /> Shopping Cart ({cartItems.reduce((a, b) => a + b.qty, 0)})
            </h1>
          </div>
        </div>

        {/* Cart Content */}
        {cartItems.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <ShoppingCart size={64} className="mx-auto text-slate-300 dark:text-slate-700" />
            <h3 className="text-lg font-bold text-slate-500">Aapka cart khaali hai!</h3>
            <p className="text-xs text-slate-400">Pehle kuch products add karein phir checkout karen.</p>
            <button 
              onClick={() => setActivePage && setActivePage('manage')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Items List */}
            <div className="md:col-span-2 space-y-3">
              {cartItems.map(item => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b]/60 flex items-center gap-4 shadow-xs"
                >
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'} 
                    alt={item.name} 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                    <p className="text-xs font-bold text-emerald-500 mt-1">${item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold px-3">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary / Checkout Box */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b]/60 shadow-xs h-fit space-y-4">
              <h3 className="text-base font-bold border-b pb-3 border-slate-200 dark:border-slate-800">Order Summary</h3>
              
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">${totalCartAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-emerald-500">Free</span>
                </div>
              </div>

              <div className="border-t pt-3 border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm font-bold">
                <span>Total Amount:</span>
                <span className="text-emerald-500 text-base">${totalCartAmount.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : <><CheckCircle size={16} /> Proceed to Checkout</>}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
