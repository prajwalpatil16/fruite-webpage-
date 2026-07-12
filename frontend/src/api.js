const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function api(path, { method = 'GET', token, body, headers = {}, timeoutMs = 12000 } = {}) {
  const opts = {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };
  if (body !== undefined) {
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  if (controller) opts.signal = controller.signal;
  const timer = controller && timeoutMs
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;

  try {
    const res = await fetch(`${API_BASE}${path}`, opts);
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { ok: res.ok, status: res.status, data };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export { API_BASE };
