import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../api';

/**
 * Official Google Identity Services button.
 * Needs GOOGLE_CLIENT_ID (backend) and/or VITE_GOOGLE_CLIENT_ID (frontend),
 * plus Authorized JavaScript origins: http://localhost:5173
 */
export default function GoogleSignInButton({ onSuccess, onError, text = 'continue_with' }) {
  const btnRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [clientId, setClientId] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [gisError, setGisError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fromEnv = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
      if (fromEnv) {
        if (!cancelled) setClientId(fromEnv);
        return;
      }
      const { ok, data } = await api('/api/auth/google-config');
      if (cancelled) return;
      if (ok && data?.enabled && data.client_id) setClientId(data.client_id);
      else setBlocked(true);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!clientId || !btnRef.current) return undefined;

    const render = () => {
      if (!window.google?.accounts?.id || !btnRef.current) return;
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              const { ok, data } = await api('/api/auth/google', {
                method: 'POST',
                body: { credential: response.credential },
              });
              if (ok) onSuccess?.(data);
              else onError?.(data?.msg || 'Google sign-in failed');
            } catch {
              onError?.('Google sign-in failed');
            }
          },
        });
        btnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(btnRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text,
          width: Math.min(btnRef.current.offsetWidth || 320, 400),
        });
        setReady(true);
        setGisError('');
      } catch (err) {
        setGisError(err?.message || 'Could not start Google Sign-In');
        setBlocked(true);
      }
    };

    if (window.google?.accounts?.id) {
      render();
      return undefined;
    }

    const existing = document.querySelector('script[data-google-gis]');
    if (existing) {
      existing.addEventListener('load', render);
      return () => existing.removeEventListener('load', render);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleGis = '1';
    script.onload = render;
    script.onerror = () => setGisError('Could not load Google Sign-In script');
    document.head.appendChild(script);
    return undefined;
  }, [clientId, text, onSuccess, onError]);

  if (blocked && !clientId) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-left text-xs leading-relaxed text-amber-950">
        <p className="font-semibold">Google Sign-In needs a Client ID</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4">
          <li>
            Google Cloud Console → APIs &amp; Services → Credentials → Create OAuth Web client
          </li>
          <li>
            Add Authorized JavaScript origins:{' '}
            <code className="font-mono">http://localhost:5173</code> and{' '}
            <code className="font-mono">http://127.0.0.1:5173</code>
          </li>
          <li>
            Put the Client ID in <code className="font-mono">backend/.env</code> as{' '}
            <code className="font-mono">GOOGLE_CLIENT_ID</code> and in{' '}
            <code className="font-mono">frontend/.env</code> as{' '}
            <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code>
          </li>
          <li>Restart Flask and Vite</li>
        </ol>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      {!ready && clientId && (
        <p className="text-center text-xs text-gray-400">Loading Google…</p>
      )}
      {gisError && (
        <p className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {gisError}. If the button fails with an origin error, add{' '}
          <code className="font-mono">http://localhost:5173</code> under Authorized JavaScript
          origins for this OAuth client.
        </p>
      )}
      <div ref={btnRef} className="flex min-h-[44px] w-full justify-center" />
    </div>
  );
}
