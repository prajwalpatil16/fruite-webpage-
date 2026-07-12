import React, { useState } from 'react';
import { Loader2, Mail, Phone, ShieldCheck } from 'lucide-react';
import { api } from '../../api';

/**
 * Compact email/phone OTP block for registration.
 * Parent supplies email + phone from the form; returns verified otp payload via onVerified.
 */
const OtpVerify = ({ email, phone, onVerified, verified }) => {
  const [channel, setChannel] = useState('email');
  const [otpId, setOtpId] = useState(null);
  const [code, setCode] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const destination = channel === 'email' ? (email || '').trim() : (phone || '').trim();

  const send = async () => {
    setErr('');
    setMsg('');
    setDevOtp('');
    if (channel === 'email' && !destination.includes('@')) {
      setErr('Enter a valid email first');
      return;
    }
    if (channel === 'phone' && destination.replace(/\D/g, '').length < 8) {
      setErr('Enter a valid phone number first');
      return;
    }
    setBusy(true);
    try {
      const body =
        channel === 'email'
          ? { channel: 'email', email: destination, purpose: 'register' }
          : { channel: 'phone', phone: destination, purpose: 'register' };
      const { ok, data } = await api('/api/auth/otp/send', { method: 'POST', body });
      if (!ok) {
        setErr(data?.msg || 'Could not send OTP');
        return;
      }
      setOtpId(data.otp_id);
      setMsg(data.msg || 'OTP sent');
      if (data.dev_otp) setDevOtp(data.dev_otp);
      onVerified?.(null);
    } catch {
      setErr('Could not send OTP');
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setErr('');
    if (!otpId || code.trim().length < 4) {
      setErr('Enter the OTP you received');
      return;
    }
    setBusy(true);
    try {
      const { ok, data } = await api('/api/auth/otp/verify', {
        method: 'POST',
        body: {
          otp_id: otpId,
          code: code.trim(),
          channel,
          destination,
          purpose: 'register',
        },
      });
      if (!ok) {
        setErr(data?.msg || 'Incorrect OTP');
        return;
      }
      setMsg('Verified');
      onVerified?.({
        otp_id: otpId,
        otp_code: code.trim(),
        otp_channel: channel,
      });
    } catch {
      setErr('Verification failed');
    } finally {
      setBusy(false);
    }
  };

  if (verified) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-800">
        <ShieldCheck size={16} /> {channel === 'email' ? 'Email' : 'Phone'} verified
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#3d2f24]/10 bg-[#f7f3eb]/70 p-2.5">
      <div className="mb-2 flex gap-1.5">
        <button
          type="button"
          onClick={() => {
            setChannel('email');
            setOtpId(null);
            setCode('');
            setDevOtp('');
            onVerified?.(null);
          }}
          className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-bold ${
            channel === 'email' ? 'bg-[#1f6b3a] text-white' : 'bg-white text-[#6b5e52]'
          }`}
        >
          <Mail size={12} /> Email OTP
        </button>
        <button
          type="button"
          onClick={() => {
            setChannel('phone');
            setOtpId(null);
            setCode('');
            setDevOtp('');
            onVerified?.(null);
          }}
          className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-bold ${
            channel === 'phone' ? 'bg-[#1f6b3a] text-white' : 'bg-white text-[#6b5e52]'
          }`}
        >
          <Phone size={12} /> Phone OTP
        </button>
      </div>

      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={send}
          disabled={busy}
          className="shrink-0 rounded-lg border border-[#1f6b3a]/30 bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#1f6b3a] disabled:opacity-50"
        >
          {busy && !otpId ? <Loader2 size={12} className="animate-spin" /> : otpId ? 'Resend' : 'Send OTP'}
        </button>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="6-digit OTP"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="min-w-0 flex-1 rounded-lg border border-[#3d2f24]/12 bg-white px-2.5 py-1.5 text-sm tracking-widest outline-none focus:border-[#1f6b3a]"
        />
        <button
          type="button"
          onClick={verify}
          disabled={busy || !otpId}
          className="shrink-0 rounded-lg bg-[#1f6b3a] px-2.5 py-1.5 text-[11px] font-bold text-white disabled:opacity-50"
        >
          Verify
        </button>
      </div>

      {devOtp && (
        <p className="mt-1.5 text-[10px] font-medium text-amber-800">
          Dev OTP: <span className="font-mono text-sm">{devOtp}</span>
        </p>
      )}
      {msg && !devOtp && <p className="mt-1 text-[10px] text-[#1f6b3a]">{msg}</p>}
      {err && <p className="mt-1 text-[10px] text-red-600">{err}</p>}
    </div>
  );
};

export default OtpVerify;
