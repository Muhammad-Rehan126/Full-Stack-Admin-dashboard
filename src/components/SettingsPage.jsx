import React from 'react';

export default function SettingsPage({ activePage, setActivePage }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Settings Page</h1>
      <button 
        onClick={() => setActivePage('dashboard')}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl"
      >
        Go Back to Dashboard
      </button>
    </div>
  );
}













// import React from 'react';
// import MainLayout from './MainLayout';
import { Settings as SettingsIcon, Shield, Bell, User } from 'lucide-react';

// export default function SettingsPage({ setActivePage }) {
//   return (
//     <MainLayout activePage="settings" setActivePage={setActivePage}>
//       <div className="max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
//         <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
//           <SettingsIcon size={20} className="text-blue-500" /> Admin Settings
//         </h1>
//         <p className="text-xs text-slate-400 mb-6">Manage your account preferences, security, and notification settings.</p>

//         <div className="space-y-4 text-xs">
//           <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
//             <div className="flex items-center gap-3 font-bold">
//               <User size={16} /> Profile Information
//             </div>
//             <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold">Edit Profile</button>
//           </div>

//           <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
//             <div className="flex items-center gap-3 font-bold">
//               <Shield size={16} /> Two-Factor Authentication
//             </div>
//             <span className="text-emerald-500 font-bold">Enabled</span>
//           </div>

//           <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
//             <div className="flex items-center gap-3 font-bold">
//               <Bell size={16} /> Email Alerts & Notifications
//             </div>
//             <span className="text-blue-500 font-bold">Active</span>
//           </div>
//         </div>
//       </div>
//     </MainLayout>
//   );
// }