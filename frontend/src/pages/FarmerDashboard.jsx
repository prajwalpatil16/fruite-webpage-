import React, { useEffect, useState } from 'react';
import { Link, Navigate, Routes, Route, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Sprout, Loader2, Plus, Pencil, RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const shellLink =
  'tap-target inline-flex shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-bold transition-colors';

const MAX_GALLERY = 5;

function readFilesAsDataUrls(fileList, existing, max = MAX_GALLERY) {
  const files = Array.from(fileList || []).slice(0, Math.max(0, max - existing.length));
  return Promise.all(
    files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        }),
    ),
  ).then((urls) => [...existing, ...urls.filter(Boolean)].slice(0, max));
}

function FarmerShell() {
  const { user, token, isFarmer, isNewSeller } = useAuth();
  const status = user?.farmer_status;

  if (!token) return <Navigate to="/login" replace />;
  if (!isFarmer) return <Navigate to="/sell" replace />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {(status === 'pending' || status === 'rejected') && (
        <div className={`border-b px-4 py-3 text-sm ${status === 'rejected' ? 'border-red-200 bg-red-50 text-red-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
          <div className="mx-auto flex max-w-6xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium">
              {status === 'rejected'
                ? `Application not approved${user?.rejection_reason ? `: ${user.rejection_reason}` : '.'}`
                : 'Your farm application is under review. You can prepare products and profile now — listings go live after approval.'}
            </p>
            {status === 'pending' && (
              <Link to="/farmer/pending" className="shrink-0 font-bold underline underline-offset-2">
                Review status
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="bg-green-800 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-3 px-4 py-5 sm:py-6">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-green-200 sm:text-xs">
              My Farm Dashboard
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-extrabold sm:text-2xl">
                {user?.farm_name || 'Your farm'}
              </h1>
              {isNewSeller && (
                <span className="rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950">
                  New Seller
                </span>
              )}
            </div>
          </div>
          <Link to="/" className="tap-target inline-flex items-center text-sm text-green-100 hover:text-white">
            ← FruitBasket
          </Link>
        </div>
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-4 hide-scrollbar">
          {[
            ['', 'Overview', LayoutDashboard],
            ['products', 'Products', Package],
            ['orders', 'Orders', ShoppingBag],
            ['returns', 'Returns', RotateCcw],
            ['profile', 'Profile', Sprout],
          ].map(([path, label, Icon]) => (
            <NavLink
              key={label}
              end={path === ''}
              to={path === '' ? '/farmer' : `/farmer/${path}`}
              className={({ isActive }) =>
                `${shellLink} ${isActive ? 'bg-white text-green-800' : 'text-green-100 hover:bg-green-700'}`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Outlet />
      </div>
    </div>
  );
}

function Overview() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { ok, data: d } = await api('/api/farmer/dashboard', { token });
      if (ok) {
        setData(d);
      } else {
        setData(null);
        setError(d?.msg || 'Could not load dashboard');
      }
    } catch {
      setData(null);
      setError('Could not load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-green-600" /></div>;
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
        <p className="mb-4 text-gray-600">{error || 'Something went wrong'}</p>
        <button
          type="button"
          onClick={load}
          className="tap-target rounded-xl bg-green-600 px-5 text-sm font-bold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const cards = [
    ['This week', data.this_week?.order_count ?? 0, 'orders', `₹${data.this_week?.revenue ?? 0}`],
    ['This month', data.this_month?.units_sold ?? 0, 'units sold', `₹${data.this_month?.revenue ?? 0}`],
    ['Needs action', data.pending_fulfillments ?? 0, 'pending fulfillments', `${data.active_products ?? 0} live products`],
  ];

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-gray-600">
        Here’s what’s moving on your farm this week. Pack pending orders first — customers see your status on their unified order.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {cards.map(([title, value, sub, extra]) => (
          <div key={title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</p>
            <p className="mt-2 text-3xl font-black text-gray-900">{value}</p>
            <p className="mt-1 text-sm text-gray-500">{sub}</p>
            <p className="mt-3 text-xs font-bold text-green-700">{extra}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Products() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', unit: 'Kg', category_id: '', stock_quantity: 0,
    gallery_urls: [], tags: '', is_active: true,
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [p, c] = await Promise.all([
      api('/api/farmer/products', { token }),
      api('/api/products/categories'),
    ]);
    if (p.ok) setProducts(p.data);
    if (c.ok) setCategories(c.data);
  };

  useEffect(() => { load(); }, [token]);

  const openNew = () => {
    setEditing('new');
    setForm({
      name: '', description: '', price: '', unit: 'Kg',
      category_id: categories[0]?.id || '', stock_quantity: 0, gallery_urls: [], tags: '', is_active: true,
    });
  };

  const openEdit = (p) => {
    const gallery = (p.gallery_urls && p.gallery_urls.length)
      ? p.gallery_urls
      : (p.image_url ? [p.image_url] : []);
    setEditing(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      unit: p.unit || 'Kg',
      category_id: p.category_id,
      stock_quantity: p.stock_quantity,
      gallery_urls: gallery,
      tags: p.tags || '',
      is_active: p.is_active,
    });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const gallery = (form.gallery_urls || []).filter(Boolean).slice(0, MAX_GALLERY);
    const body = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      unit: form.unit,
      stock_quantity: parseInt(form.stock_quantity, 10) || 0,
      category_id: parseInt(form.category_id, 10),
      tags: form.tags,
      is_active: form.is_active,
      gallery_urls: gallery,
      image_url: gallery[0] || '',
    };
    const { ok } = editing === 'new'
      ? await api('/api/farmer/products', { method: 'POST', token, body })
      : await api(`/api/farmer/products/${editing}`, { method: 'PUT', token, body });
    setSaving(false);
    if (ok) {
      setEditing(null);
      load();
    } else {
      alert('Could not save product');
    }
  };

  const deactivate = async (id) => {
    await api(`/api/farmer/products/${id}`, { method: 'DELETE', token });
    load();
  };

  const onGalleryPick = async (e) => {
    const next = await readFilesAsDataUrls(e.target.files, form.gallery_urls || []);
    setForm((prev) => ({ ...prev, gallery_urls: next }));
    e.target.value = '';
  };

  const removeGalleryAt = (idx) => {
    setForm((prev) => ({
      ...prev,
      gallery_urls: (prev.gallery_urls || []).filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">My products</h2>
        <button
          type="button"
          onClick={openNew}
          className="tap-target inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-bold text-white"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="grid gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:grid-cols-2 sm:gap-4 sm:rounded-3xl sm:p-6">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="tap-target rounded-xl bg-gray-50 px-3" />
          <input required type="number" inputMode="decimal" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="tap-target rounded-xl bg-gray-50 px-3" />
          <input placeholder="Unit (Kg, Dozen…)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="tap-target rounded-xl bg-gray-50 px-3" />
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="tap-target rounded-xl bg-gray-50 px-3">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="number" inputMode="numeric" placeholder="Stock" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} className="tap-target rounded-xl bg-gray-50 px-3" />
          <div className="space-y-2 sm:col-span-2">
            <p className="text-sm font-medium text-gray-700">
              Photos ({(form.gallery_urls || []).length}/{MAX_GALLERY})
            </p>
            <label className="tap-target flex cursor-pointer flex-col justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 text-sm font-medium text-gray-600">
              <span>Add photos (up to {MAX_GALLERY})</span>
              <input
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                className="sr-only"
                disabled={(form.gallery_urls || []).length >= MAX_GALLERY}
                onChange={onGalleryPick}
              />
            </label>
            {(form.gallery_urls || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.gallery_urls.map((url, idx) => (
                  <div key={`${idx}-${url.slice(0, 24)}`} className="relative">
                    <img src={url} alt="" className="h-20 w-20 rounded-xl object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryAt(idx)}
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] font-bold text-white">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl bg-gray-50 p-3 sm:col-span-2" rows={3} />
          <label className="tap-target flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active in marketplace
          </label>
          <div className="flex gap-2 sm:col-span-2 sm:justify-end">
            <button type="button" onClick={() => setEditing(null)} className="tap-target rounded-xl px-4 font-bold text-gray-500">Cancel</button>
            <button type="submit" disabled={saving} className="tap-target rounded-xl bg-green-600 px-4 font-bold text-white disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 sm:items-center sm:gap-4 sm:p-4">
            <img
              src={p.image_url || 'https://via.placeholder.com/80'}
              alt=""
              loading="lazy"
              className="h-16 w-16 shrink-0 rounded-xl bg-gray-50 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-gray-900">{p.name}</p>
              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                ₹{p.price}/{p.unit} · Stock {p.stock_quantity} · {p.is_active ? 'Live' : 'Hidden'}
                {(p.gallery_urls?.length || 0) > 1 ? ` · ${p.gallery_urls.length} photos` : ''}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 sm:hidden">
                <button type="button" onClick={() => openEdit(p)} className="tap-target rounded-lg bg-gray-50 px-3 text-xs font-bold text-gray-700">
                  Edit
                </button>
                {p.is_active && (
                  <button type="button" onClick={() => deactivate(p.id)} className="tap-target rounded-lg bg-red-50 px-3 text-xs font-bold text-red-600">
                    Deactivate
                  </button>
                )}
              </div>
            </div>
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <button type="button" onClick={() => openEdit(p)} className="tap-target flex items-center justify-center text-gray-500 hover:text-green-700" aria-label="Edit">
                <Pencil size={18} />
              </button>
              {p.is_active && (
                <button type="button" onClick={() => deactivate(p.id)} className="text-xs font-bold text-red-600 hover:underline">
                  Deactivate
                </button>
              )}
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-gray-500">No products yet. Add your first listing.</p>}
      </div>
    </div>
  );
}

function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const { ok, data } = await api('/api/farmer/orders', { token });
    if (ok) setOrders(data);
  };

  useEffect(() => { load(); }, [token]);

  const updateStatus = async (id, status) => {
    await api(`/api/farmer/orders/${id}/status`, {
      method: 'PUT',
      token,
      body: { status },
    });
    load();
  };

  const statuses = ['placed', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Orders with your produce</h2>
      <p className="text-sm text-gray-500">You only see your portion of multi-farm orders.</p>
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="font-bold text-gray-900">Order FB-{o.order_id}</p>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {o.customer_name} · {o.created_at ? new Date(o.created_at).toLocaleDateString() : ''} · ₹{o.subtotal}
              </p>
            </div>
            <select
              value={o.status}
              onChange={(e) => updateStatus(o.id, e.target.value)}
              aria-label="Update fulfillment status"
              className="tap-target w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-bold capitalize sm:w-auto"
            >
              {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <ul className="space-y-2">
            {(o.items || []).map((item) => (
              <li key={item.id} className="flex justify-between text-sm text-gray-700">
                <span>{item.product?.name}</span>
                <span className="font-bold">×{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {orders.length === 0 && (
        <p className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-500">
          No orders yet. When customers buy your produce, fulfillments show up here.
        </p>
      )}
    </div>
  );
}

function ReturnsTab() {
  const { token } = useAuth();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    const { ok, data } = await api('/api/returns/farmer', { token });
    if (ok) setReturns(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [token]);

  const act = async (id, action) => {
    setBusyId(id);
    await api(`/api/returns/${id}/${action}`, { method: 'POST', token, body: {} });
    setBusyId(null);
    load();
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-green-600" /></div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Return requests</h2>
      <p className="text-sm text-gray-500">Approve to restore stock, or reject with a note if needed.</p>
      {returns.map((r) => (
        <div key={r.id} className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="font-bold text-gray-900">{r.product_name || 'Item'}</p>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Qty {r.quantity} · {r.customer_name} · Order #{r.order_id}
                {r.created_at ? ` · ${new Date(r.created_at).toLocaleDateString()}` : ''}
              </p>
              <p className="mt-2 text-sm text-gray-700">{r.reason}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                {r.status}
              </p>
            </div>
            {r.status === 'requested' && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => act(r.id, 'approve')}
                  className="tap-target rounded-xl bg-green-600 px-4 text-sm font-bold text-white disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => act(r.id, 'reject')}
                  className="tap-target rounded-xl bg-red-50 px-4 text-sm font-bold text-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      {returns.length === 0 && (
        <p className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-500">
          No return requests yet.
        </p>
      )}
    </div>
  );
}

function FarmProfile() {
  const { token, refreshProfile } = useAuth();
  const [form, setForm] = useState({ farm_name: '', location: '', description: '', photo_url: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api('/api/farmer/me', { token }).then(({ ok, data }) => {
      if (ok) {
        setForm({
          farm_name: data.farm_name || '',
          location: data.location || '',
          description: data.description || '',
          photo_url: data.photo_url || '',
        });
      }
    });
  }, [token]);

  const save = async (e) => {
    e.preventDefault();
    const { ok } = await api('/api/farmer/me', { method: 'PUT', token, body: form });
    if (ok) {
      setSaved(true);
      refreshProfile();
    }
  };

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4 rounded-2xl border border-gray-100 bg-white p-5 sm:rounded-3xl sm:p-8">
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Farm profile</h2>
      <p className="text-sm text-gray-500">
        This is what customers read on FruitBasket. Tell the story behind the harvest — not just the SKU list.
      </p>
      <input required value={form.farm_name} onChange={(e) => setForm({ ...form, farm_name: e.target.value })} placeholder="Farm name" className="tap-target w-full rounded-xl bg-gray-50 px-3" />
      <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="tap-target w-full rounded-xl bg-gray-50 px-3" />
      <div className="space-y-2">
        <input type="url" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} placeholder="Photo URL (optional if you upload)" className="tap-target w-full rounded-xl bg-gray-50 px-3" />
        <label className="tap-target flex cursor-pointer flex-col justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 text-sm font-medium text-gray-600">
          <span>Take photo or choose from gallery</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === 'string') {
                  setForm((prev) => ({ ...prev, photo_url: reader.result }));
                }
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
        {form.photo_url && (
          <img src={form.photo_url} alt="" className="h-24 w-24 rounded-xl object-cover" />
        )}
      </div>
      <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Your farm story" className="w-full rounded-xl bg-gray-50 p-3" />
      {saved && <p className="text-sm font-medium text-green-700">Saved. Customers will see the update on your public profile.</p>}
      <button type="submit" className="tap-target w-full rounded-2xl bg-green-600 px-6 text-sm font-bold text-white sm:w-auto">
        Save farm profile
      </button>
    </form>
  );
}

function Pending() {
  const { user, token, isFarmer, logout } = useAuth();
  const navigate = useNavigate();

  if (!token) return <Navigate to="/login" replace />;
  if (!isFarmer) return <Navigate to="/sell" replace />;
  if (user?.farmer_status === 'approved') return <Navigate to="/farmer" replace />;

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <Sprout className="mx-auto mb-4 text-amber-500" size={40} />
      <h1 className="mb-3 text-2xl font-extrabold text-gray-900">
        {user?.farmer_status === 'rejected' ? 'Application not approved' : 'Application under review'}
      </h1>
      <p className="mb-4 text-gray-600">
        {user?.farm_name ? <strong>{user.farm_name}</strong> : 'Your farm'} is not live on the marketplace yet.
      </p>
      {user?.farmer_status === 'rejected' && user?.rejection_reason && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-left text-sm text-red-800">
          <p className="mb-1 font-bold">Reason from FruitBasket</p>
          <p>{user.rejection_reason}</p>
        </div>
      )}
      {user?.farmer_status === 'pending' && (
        <p className="mb-6 text-sm text-gray-500">
          You can still use the farm dashboard to prepare products and your profile. Listings go live after approval.
        </p>
      )}
      <div className="flex flex-col items-center gap-3">
        <Link
          to="/farmer"
          className="tap-target inline-flex rounded-xl bg-green-600 px-5 text-sm font-bold text-white"
        >
          Open dashboard
        </Link>
        <button
          type="button"
          onClick={() => { logout(); navigate('/'); }}
          className="font-bold text-green-700 hover:underline"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function FarmerDashboard() {
  return (
    <Routes>
      <Route path="pending" element={<Pending />} />
      <Route element={<FarmerShell />}>
        <Route index element={<Overview />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="returns" element={<ReturnsTab />} />
        <Route path="profile" element={<FarmProfile />} />
      </Route>
    </Routes>
  );
}
