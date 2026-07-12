import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import AuthShell from '../components/auth/AuthShell';
import PasswordInput from '../components/auth/PasswordInput';

const field =
  'w-full rounded-xl border border-[#3d2f24]/12 bg-[#f7f3eb]/50 px-3.5 py-2.5 text-sm text-[#3d2f24] outline-none placeholder:text-[#9a8f84] focus:border-[#1f6b3a] focus:bg-white focus:ring-2 focus:ring-[#1f6b3a]/20';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const { login, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const routeAfterAuth = (u) => {
    if (u?.role === 'admin') navigate('/admin');
    else if (u?.role === 'farmer') navigate('/farmer');
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const result = await login(formData.email.trim(), formData.password);
    if (result.success) routeAfterAuth(result.user);
    else setError(result.message || 'Could not sign in');
  };

  const onGoogleSuccess = useCallback(async (data) => {
    setError('');
    const result = await loginWithGoogle(data);
    if (result.linked) setInfo(result.message || 'Google linked to your existing account.');
    routeAfterAuth(result.user);
  }, [loginWithGoogle]);

  return (
    <AuthShell
      headline="Welcome back"
      subhead={
        <>
          New here?{' '}
          <Link to="/register" className="font-semibold text-[#1f6b3a] hover:underline">
            Create an account
          </Link>
        </>
      }
      asideQuote="Fresh produce, real farms, no middlemen."
    >
      {error && (
        <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}
      {info && (
        <div className="mb-3 rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-xs text-green-800">
          {info}
        </div>
      )}

      <GoogleSignInButton
        text="signin_with"
        onSuccess={onGoogleSuccess}
        onError={(msg) => setError(msg)}
      />

      <div className="my-3 flex items-center gap-2">
        <div className="h-px flex-1 bg-[#3d2f24]/10" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a8f84]">or</span>
        <div className="h-px flex-1 bg-[#3d2f24]/10" />
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-email" className="mb-1 block text-xs font-semibold text-[#3d2f24]">
            Email
          </label>
          <input
            id="login-email"
            name="fruitbasket-email"
            type="email"
            autoComplete="username"
            required
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={field}
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="login-password" className="text-xs font-semibold text-[#3d2f24]">
              Password
            </label>
            <Link to="/help/forgot-password" className="text-[11px] font-semibold text-[#1f6b3a] hover:underline">
              Forgot?
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            name="fruitbasket-password"
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-[#1f6b3a] py-2.5 text-sm font-bold text-white hover:bg-[#185530] disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign in'}
        </button>
      </form>

      <div className="mt-3 rounded-xl border border-[#1f6b3a]/15 bg-[#eef5ef] px-3 py-2 text-center">
        <p className="flex items-center justify-center gap-1 text-xs font-semibold text-[#1f6b3a]">
          <Sprout size={14} /> Selling?{' '}
          <Link to="/sell" className="underline underline-offset-2">
            Apply to sell
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default Login;
