import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Sprout, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import AuthShell from '../components/auth/AuthShell';
import PasswordInput from '../components/auth/PasswordInput';
import OtpVerify from '../components/auth/OtpVerify';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  farm_name: '',
  location: '',
  description: '',
};

const field =
  'mt-1 w-full rounded-xl border border-[#3d2f24]/12 bg-[#f7f3eb]/50 px-3 py-2 text-sm text-[#3d2f24] outline-none placeholder:text-[#9a8f84] focus:border-[#1f6b3a] focus:bg-white focus:ring-2 focus:ring-[#1f6b3a]/20';

const Register = () => {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState(emptyForm);
  const [otp, setOtp] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { register, registerFarmer, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setOtp(null);
  };

  const onGoogleSuccess = useCallback(async (data) => {
    setError('');
    await loginWithGoogle(data);
    navigate('/');
  }, [loginWithGoogle, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otp?.otp_id) {
      setError('Verify your email or phone with OTP before continuing.');
      return;
    }

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    if (!fullName) {
      setError('Please enter your name.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const otpPayload = {
      otp_id: otp.otp_id,
      otp_code: otp.otp_code,
      otp_channel: otp.otp_channel,
    };

    if (role === 'farmer') {
      if (!formData.farm_name.trim() || !formData.location.trim()) {
        setError('Farm name and location are required.');
        return;
      }
      const result = await registerFarmer({
        name: fullName,
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        farm_name: formData.farm_name.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        ...otpPayload,
      });
      if (result.success) {
        setSuccessMsg(result.message || 'Application submitted.');
        setTimeout(() => navigate('/login'), 1600);
      } else {
        setError(result.message || 'Could not submit farm application');
      }
      return;
    }

    const result = await register(
      fullName,
      formData.email.trim(),
      formData.password,
      formData.phone.trim(),
      otpPayload
    );
    if (result.success) {
      setSuccessMsg('Account created. Redirecting…');
      setTimeout(() => navigate('/login'), 1200);
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  return (
    <AuthShell
      compact
      headline="Join FruitBasket"
      subhead={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#1f6b3a] hover:underline">
            Sign in
          </Link>
        </>
      }
      asideQuote="Start with a farm you can name — and food that tastes like itself."
    >
      <div className="mb-2.5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left ${
            role === 'customer' ? 'border-[#1f6b3a] bg-[#eef5ef]' : 'border-[#3d2f24]/10'
          }`}
        >
          <User size={18} className={role === 'customer' ? 'text-[#1f6b3a]' : 'text-gray-400'} />
          <div>
            <div className={`text-xs font-bold ${role === 'customer' ? 'text-[#1f6b3a]' : 'text-gray-700'}`}>
              Customer
            </div>
            <div className="text-[10px] text-gray-500">Buy fresh</div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setRole('farmer')}
          className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left ${
            role === 'farmer' ? 'border-[#1f6b3a] bg-[#eef5ef]' : 'border-[#3d2f24]/10'
          }`}
        >
          <Sprout size={18} className={role === 'farmer' ? 'text-[#1f6b3a]' : 'text-gray-400'} />
          <div>
            <div className={`text-xs font-bold ${role === 'farmer' ? 'text-[#1f6b3a]' : 'text-gray-700'}`}>
              Farmer
            </div>
            <div className="text-[10px] text-gray-500">Sell harvest</div>
          </div>
        </button>
      </div>

      {error && (
        <div className="mb-2 rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-xs text-red-700">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="mb-2 rounded-xl border border-green-100 bg-green-50 px-3 py-1.5 text-xs text-green-800">
          {successMsg}
        </div>
      )}

      {role === 'customer' && (
        <div className="mb-2">
          <GoogleSignInButton
            text="signup_with"
            onSuccess={onGoogleSuccess}
            onError={(msg) => setError(msg)}
          />
          <div className="my-2 flex items-center gap-2">
            <div className="h-px flex-1 bg-[#3d2f24]/10" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#9a8f84]">or</span>
            <div className="h-px flex-1 bg-[#3d2f24]/10" />
          </div>
        </div>
      )}

      <form className="space-y-2" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="reg-first" className="text-[11px] font-semibold text-[#3d2f24]">
              First name
            </label>
            <input
              id="reg-first"
              name="firstName"
              required
              autoComplete="given-name"
              value={formData.firstName}
              onChange={onChange}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="reg-last" className="text-[11px] font-semibold text-[#3d2f24]">
              Last name
            </label>
            <input
              id="reg-last"
              name="lastName"
              required
              autoComplete="family-name"
              value={formData.lastName}
              onChange={onChange}
              className={field}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="reg-email" className="text-[11px] font-semibold text-[#3d2f24]">
              Email
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={onChange}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="reg-phone" className="text-[11px] font-semibold text-[#3d2f24]">
              Phone
            </label>
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91…"
              value={formData.phone}
              onChange={onChange}
              className={field}
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-password" className="text-[11px] font-semibold text-[#3d2f24]">
            Password
          </label>
          <div className="mt-1">
            <PasswordInput
              id="reg-password"
              name="password"
              autoComplete="new-password"
              minLength={6}
              value={formData.password}
              onChange={onChange}
              placeholder="Min 6 characters"
            />
          </div>
        </div>

        {role === 'farmer' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="reg-farm" className="text-[11px] font-semibold text-[#3d2f24]">
                Farm name
              </label>
              <input
                id="reg-farm"
                name="farm_name"
                required
                value={formData.farm_name}
                onChange={onChange}
                className={field}
              />
            </div>
            <div>
              <label
                htmlFor="reg-loc"
                className="flex items-center gap-0.5 text-[11px] font-semibold text-[#3d2f24]"
              >
                <MapPin size={11} /> Location
              </label>
              <input
                id="reg-loc"
                name="location"
                required
                value={formData.location}
                onChange={onChange}
                className={field}
              />
            </div>
          </div>
        )}

        <OtpVerify
          email={formData.email}
          phone={formData.phone}
          verified={!!otp}
          onVerified={setOtp}
        />

        <button
          type="submit"
          disabled={loading || !otp}
          className="flex w-full items-center justify-center rounded-xl bg-[#1f6b3a] py-2.5 text-sm font-bold text-white hover:bg-[#185530] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : role === 'farmer' ? (
            'Submit application'
          ) : (
            'Create account'
          )}
        </button>
      </form>
    </AuthShell>
  );
};

export default Register;
