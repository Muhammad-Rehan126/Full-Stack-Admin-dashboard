import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import API from '../lib/api';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;

    setError('');
    setNotice('');
    setIsSubmitting(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      onLogin(data.user);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRecoverySubmit(event) {
    event.preventDefault();
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;

    setError('');
    setNotice('');
    if (newPassword !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await API.post('/auth/recover', { email, recoveryKey, password: newPassword });
      setMode('login');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setRecoveryKey('');
      setNotice(data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 text-slate-900 sm:py-10">
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 -top-32 size-96 rounded-full bg-blue-100/70 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-24 size-[28rem] rounded-full bg-sky-100/70 blur-3xl" />

      <section className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-9" aria-labelledby="auth-title">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/20">B</div>
          <div>
            <p className="text-sm font-extrabold tracking-[0.2em] text-slate-900">BERRY</p>
            <p className="mt-0.5 text-xs text-slate-500">Admin workspace</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Welcome back</p>
          <h1 id="auth-title" className="text-3xl font-bold tracking-tight text-slate-900">{mode === 'login' ? 'Sign in to your account' : 'Reset admin password'}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{mode === 'login' ? 'Use your administrator email and password to continue.' : 'Use the temporary recovery key from Railway to set a new password.'}</p>
        </div>

        {notice && mode === 'login' && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p>}

        {mode === 'login' ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
              <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15">
                <Mail size={17} className="shrink-0 text-slate-400" aria-hidden="true" />
                <input id="email" name="email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15">
                <LockKeyhole size={17} className="shrink-0 text-slate-400" aria-hidden="true" />
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="inline-flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                </button>
              </div>
            </div>

            {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

            <button type="submit" disabled={isSubmitting} className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
              {!isSubmitting && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRecoverySubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="recovery-email" className="mb-2 block text-sm font-medium text-slate-700">Admin email</label>
              <input id="recovery-email" name="recovery-email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
            </div>

            <div>
              <label htmlFor="recovery-key" className="mb-2 block text-sm font-medium text-slate-700">Temporary recovery key</label>
              <input id="recovery-key" name="recovery-key" type="password" autoComplete="off" required maxLength={256} value={recoveryKey} onChange={(event) => setRecoveryKey(event.target.value)} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
            </div>

            <div>
              <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-700">New password</label>
              <input id="new-password" name="new-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={8} maxLength={72} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
            </div>

            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-700">Confirm new password</label>
              <input id="confirm-password" name="confirm-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={8} maxLength={72} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
            </div>

            <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="self-start text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">{showPassword ? 'Hide passwords' : 'Show passwords'}</button>
            {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

            <button type="submit" disabled={isSubmitting} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Resetting password…' : 'Reset password'}
              {!isSubmitting && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>
        )}

        <button type="button" onClick={() => { setMode(mode === 'login' ? 'recovery' : 'login'); setError(''); setNotice(''); }} className="mt-5 w-full text-center text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          {mode === 'login' ? 'Forgot password? Use recovery key' : 'Back to sign in'}
        </button>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">{mode === 'login' ? 'Secure sign-in with an HTTP-only session cookie.' : 'The recovery key works once and is never displayed after submission.'}</p>
      </section>
    </main>
  );
}
