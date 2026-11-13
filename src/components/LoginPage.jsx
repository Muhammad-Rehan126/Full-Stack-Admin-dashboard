import { useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import API from '../lib/api';

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCreatingAccount = mode === 'register';

  async function handleSubmit(event) {
    event.preventDefault();
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;

    setError('');
    setSuccess('');
    if (isCreatingAccount && password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isCreatingAccount) {
        await API.post('/auth/register', { email, dateOfBirth, password });
        setMode('login');
        setEmail(email.trim().toLowerCase());
        setDateOfBirth('');
        setPassword('');
        setShowPassword(false);
        setSuccess('Account created successfully. Sign in with your email and password.');
      } else {
        const { data } = await API.post('/auth/login', { email, password });
        onLogin(data.user);
      }
    } catch (requestError) {
      if (isCreatingAccount && requestError.response?.status === 409) {
        setMode('login');
        setEmail(email.trim().toLowerCase());
        setDateOfBirth('');
        setPassword('');
        setShowPassword(false);
        setSuccess('Please sign in with your administrator email and password.');
      } else {
        setError(requestError.response?.data?.message || 'Could not connect to the server. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError('');
    setSuccess('');
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
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            {isCreatingAccount ? 'Initial setup' : 'Welcome back'}
          </p>
          <h1 id="auth-title" className="text-3xl font-bold tracking-tight text-slate-900">
            {isCreatingAccount ? 'Create your account' : 'Sign in to your account'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isCreatingAccount
              ? 'Set up the first administrator account for this dashboard.'
              : 'Use your administrator email and password to continue.'}
          </p>
        </div>

        {success && (
          <p role="status" className="mb-5 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-5 text-blue-800">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
            <span>{success}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
            <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15">
              <Mail size={17} className="shrink-0 text-slate-400" aria-hidden="true" />
              <input id="email" name="email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
            </div>
          </div>

          {isCreatingAccount && (
            <div>
              <label htmlFor="date-of-birth" className="mb-2 block text-sm font-medium text-slate-700">Date of birth</label>
              <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15">
                <CalendarDays size={17} className="shrink-0 text-slate-400" aria-hidden="true" />
                <input id="date-of-birth" name="dateOfBirth" type="date" autoComplete="bday" required max={new Date().toISOString().slice(0, 10)} value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none" />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15">
              <LockKeyhole size={17} className="shrink-0 text-slate-400" aria-hidden="true" />
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={isCreatingAccount ? 'new-password' : 'current-password'} required minLength={isCreatingAccount ? 8 : undefined} maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isCreatingAccount ? 'At least 8 characters' : 'Enter your password'} className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="inline-flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

          <button type="submit" disabled={isSubmitting} className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? (isCreatingAccount ? 'Creating account…' : 'Signing in…') : (isCreatingAccount ? 'Create account' : 'Sign in')}
            {!isSubmitting && <ArrowRight size={17} aria-hidden="true" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isCreatingAccount ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={() => switchMode(isCreatingAccount ? 'login' : 'register')} className="font-semibold text-blue-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            {isCreatingAccount ? 'Sign in' : 'Create account'}
          </button>
        </p>
        <p className="mt-5 text-center text-xs leading-5 text-slate-500">Secure sign-in with an HTTP-only session cookie.</p>
      </section>
    </main>
  );
}
