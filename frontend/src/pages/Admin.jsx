import React, { useEffect, useState } from 'react';
import {
  Shield, Loader2, Check, X, BookOpen, HelpCircle, Plus, Pencil, Trash2,
  Flag, Star, RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const EMPTY_POST = {
  title: '', slug: '', category: 'Our Model', excerpt: '', body: '', author_name: 'FruitBasket', is_published: false,
};
const EMPTY_HELP = {
  title: '', slug: '', category: 'Ordering & Delivery', body: '', is_published: false, sort_order: 0,
};

const Admin = () => {
  const { token } = useAuth();
  const [section, setSection] = useState('farmers');
  const [tab, setTab] = useState('pending');
  const [farmers, setFarmers] = useState([]);
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [flags, setFlags] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingHelp, setEditingHelp] = useState(null);
  const [postForm, setPostForm] = useState(EMPTY_POST);
  const [helpForm, setHelpForm] = useState(EMPTY_HELP);
  const [flagNotes, setFlagNotes] = useState({});

  const loadFarmers = async () => {
    setLoading(true);
    const status = tab === 'all' ? 'all' : tab;
    const [f, s] = await Promise.all([
      api(`/api/admin/farmers?status=${status}`, { token }),
      api('/api/admin/stats', { token }),
    ]);
    if (f.ok) setFarmers(f.data);
    if (s.ok) setStats(s.data);
    setLoading(false);
  };

  const loadBlog = async () => {
    setLoading(true);
    const { ok, data } = await api('/api/content/admin/blog', { token });
    if (ok) setPosts(data);
    setLoading(false);
  };

  const loadHelp = async () => {
    setLoading(true);
    const { ok, data } = await api('/api/content/admin/help', { token });
    if (ok) setArticles(data);
    setLoading(false);
  };

  const loadFlags = async () => {
    setLoading(true);
    const [fl, s] = await Promise.all([
      api('/api/admin/flags?status=open', { token }),
      api('/api/admin/stats', { token }),
    ]);
    if (fl.ok) setFlags(fl.data);
    if (s.ok) setStats(s.data);
    setLoading(false);
  };

  const loadReviews = async () => {
    setLoading(true);
    const [r, s] = await Promise.all([
      api('/api/reviews/admin?status=pending', { token }),
      api('/api/admin/stats', { token }),
    ]);
    if (r.ok) setReviews(r.data);
    if (s.ok) setStats(s.data);
    setLoading(false);
  };

  const loadReturns = async () => {
    setLoading(true);
    const [r, s] = await Promise.all([
      api('/api/returns/admin?status=requested', { token }),
      api('/api/admin/stats', { token }),
    ]);
    if (r.ok) setReturns(r.data);
    if (s.ok) setStats(s.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) return;
    if (section === 'farmers') loadFarmers();
    if (section === 'blog') loadBlog();
    if (section === 'help') loadHelp();
    if (section === 'flags') loadFlags();
    if (section === 'reviews') loadReviews();
    if (section === 'returns') loadReturns();
  }, [token, section, tab]);

  const approve = async (id) => {
    setBusy(true);
    await api(`/api/admin/farmers/${id}/approve`, { method: 'POST', token });
    setBusy(false);
    loadFarmers();
  };

  const reject = async () => {
    if (!reason.trim()) {
      alert('Please include a rejection reason — farmers see this in-app.');
      return;
    }
    setBusy(true);
    await api(`/api/admin/farmers/${rejectId}/reject`, {
      method: 'POST',
      token,
      body: { reason },
    });
    setBusy(false);
    setRejectId(null);
    setReason('');
    loadFarmers();
  };

  const clearNewSeller = async (id) => {
    setBusy(true);
    await api(`/api/admin/farmers/${id}/clear-new-seller`, { method: 'POST', token });
    setBusy(false);
    loadFarmers();
  };

  const resolveFlag = async (id, action) => {
    setBusy(true);
    await api(`/api/admin/flags/${id}/resolve`, {
      method: 'POST',
      token,
      body: { action, notes: flagNotes[id] || '' },
    });
    setBusy(false);
    loadFlags();
  };

  const moderateReview = async (id, action) => {
    setBusy(true);
    await api(`/api/reviews/admin/${id}/${action}`, { method: 'POST', token });
    setBusy(false);
    loadReviews();
  };

  const moderateReturn = async (id, action) => {
    setBusy(true);
    await api(`/api/returns/${id}/${action}`, { method: 'POST', token, body: {} });
    setBusy(false);
    loadReturns();
  };

  const openNewPost = () => {
    setEditingPost('new');
    setPostForm(EMPTY_POST);
  };

  const openEditPost = async (id) => {
    const { ok, data } = await api(`/api/content/admin/blog/${id}`, { token });
    if (ok) {
      setEditingPost(id);
      setPostForm({
        title: data.title,
        slug: data.slug,
        category: data.category,
        excerpt: data.excerpt || '',
        body: data.body || '',
        author_name: data.author_name || 'FruitBasket',
        is_published: data.is_published,
      });
    }
  };

  const savePost = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { ok } = editingPost === 'new'
      ? await api('/api/content/admin/blog', { method: 'POST', token, body: postForm })
      : await api(`/api/content/admin/blog/${editingPost}`, { method: 'PUT', token, body: postForm });
    setBusy(false);
    if (ok) {
      setEditingPost(null);
      loadBlog();
    } else {
      alert('Could not save post');
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete this journal post?')) return;
    setBusy(true);
    await api(`/api/content/admin/blog/${id}`, { method: 'DELETE', token });
    setBusy(false);
    loadBlog();
  };

  const openNewHelp = () => {
    setEditingHelp('new');
    setHelpForm(EMPTY_HELP);
  };

  const openEditHelp = async (id) => {
    const { ok, data } = await api(`/api/content/admin/help/${id}`, { token });
    if (ok) {
      setEditingHelp(id);
      setHelpForm({
        title: data.title,
        slug: data.slug,
        category: data.category,
        body: data.body || '',
        is_published: data.is_published,
        sort_order: data.sort_order || 0,
      });
    }
  };

  const saveHelp = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { ok } = editingHelp === 'new'
      ? await api('/api/content/admin/help', { method: 'POST', token, body: helpForm })
      : await api(`/api/content/admin/help/${editingHelp}`, { method: 'PUT', token, body: helpForm });
    setBusy(false);
    if (ok) {
      setEditingHelp(null);
      loadHelp();
    } else {
      alert('Could not save article');
    }
  };

  const deleteHelp = async (id) => {
    if (!window.confirm('Delete this help article?')) return;
    setBusy(true);
    await api(`/api/content/admin/help/${id}`, { method: 'DELETE', token });
    setBusy(false);
    loadHelp();
  };

  const statsCards = stats
    ? [
        ['Pending farms', stats.farmers_pending],
        ['Approved farms', stats.farmers_approved],
        ['Customers', stats.customers],
        ['Live products', stats.products],
        ['Orders', stats.orders],
        ['Revenue', `₹${stats.revenue ?? 0}`],
        ['Open flags', stats.open_flags],
        ['Pending reviews', stats.pending_reviews],
        ['Pending returns', stats.pending_returns],
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-6 font-sans sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-center gap-3">
          <Shield className="text-green-700" />
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Admin</h1>
        </div>
        <p className="mb-6 text-sm text-gray-500">Farms, trust queue, content, and moderation.</p>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {[
            ['farmers', 'Farmers', Shield],
            ['flags', 'Flags', Flag],
            ['reviews', 'Reviews', Star],
            ['returns', 'Returns', RotateCcw],
            ['blog', 'Journal', BookOpen],
            ['help', 'Help Center', HelpCircle],
          ].map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={`tap-target inline-flex shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold whitespace-nowrap ${
                section === id ? 'bg-green-600 text-white' : 'border border-gray-200 bg-white text-gray-600'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {stats && ['farmers', 'flags', 'reviews', 'returns'].includes(section) && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {statsCards.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-gray-100 bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
                <p className="mt-1 text-xl font-black text-gray-900 sm:text-2xl">{value}</p>
              </div>
            ))}
          </div>
        )}

        {section === 'farmers' && (
          <>
            <div className="mb-6 flex gap-2 overflow-x-auto hide-scrollbar">
              {[
                ['pending', 'Pending'],
                ['approved', 'Approved'],
                ['rejected', 'Rejected'],
                ['all', 'All'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`tap-target shrink-0 rounded-full px-4 text-sm font-bold ${tab === id ? 'bg-green-600 text-white' : 'border border-gray-200 bg-white text-gray-600'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="animate-spin text-green-600" /></div>
            ) : (
              <div className="space-y-4">
                {farmers.length === 0 && (
                  <p className="rounded-2xl border border-gray-100 bg-white py-12 text-center text-gray-500">No farms in this queue.</p>
                )}
                {farmers.map((f) => (
                  <div key={f.id} className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-bold text-gray-900">{f.farm_name}</p>
                          {f.is_new_seller && (
                            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                              New Seller
                            </span>
                          )}
                        </div>
                        <p className="mt-1 break-words text-sm text-gray-500">
                          {f.name} · {f.email} · {f.phone || 'No phone'}
                        </p>
                        <p className="mt-2 text-sm text-gray-600">{f.location}</p>
                        {f.description && <p className="mt-2 max-w-xl text-sm text-gray-500">{f.description}</p>}
                        <p className="mt-3 text-xs capitalize text-gray-400">Status: {f.status}</p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start">
                        {f.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => approve(f.id)}
                              className="tap-target inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-green-600 px-4 text-sm font-bold text-white disabled:opacity-50 sm:flex-none"
                            >
                              <Check size={16} /> Approve
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => { setRejectId(f.id); setReason(''); }}
                              className="tap-target inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-red-50 px-4 text-sm font-bold text-red-700 sm:flex-none"
                            >
                              <X size={16} /> Reject
                            </button>
                          </>
                        )}
                        {f.status === 'approved' && f.is_new_seller && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => clearNewSeller(f.id)}
                            className="tap-target inline-flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm font-bold text-amber-900 disabled:opacity-50"
                          >
                            Clear New Seller badge
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {section === 'flags' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Open seller flags</h2>
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="animate-spin text-green-600" /></div>
            ) : flags.length === 0 ? (
              <p className="rounded-2xl border border-gray-100 bg-white py-12 text-center text-gray-500">No open flags.</p>
            ) : (
              flags.map((fl) => (
                <div key={fl.id} className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
                  <div>
                    <p className="font-bold text-gray-900">{fl.farm_name || `Farmer #${fl.farmer_id}`}</p>
                    <p className="mt-2 text-sm text-gray-700">{fl.reason}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {fl.created_at ? new Date(fl.created_at).toLocaleString() : ''}
                    </p>
                  </div>
                  <input
                    placeholder="Notes (optional)"
                    value={flagNotes[fl.id] || ''}
                    onChange={(e) => setFlagNotes({ ...flagNotes, [fl.id]: e.target.value })}
                    className="tap-target w-full rounded-xl bg-gray-50 px-3 text-sm"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => resolveFlag(fl.id, 'dismissed')}
                      className="tap-target rounded-xl bg-gray-100 px-4 text-sm font-bold text-gray-700 disabled:opacity-50"
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => resolveFlag(fl.id, 'suspended')}
                      className="tap-target rounded-xl bg-red-600 px-4 text-sm font-bold text-white disabled:opacity-50"
                    >
                      Suspend seller
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {section === 'reviews' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Pending reviews</h2>
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="animate-spin text-green-600" /></div>
            ) : reviews.length === 0 ? (
              <p className="rounded-2xl border border-gray-100 bg-white py-12 text-center text-gray-500">No pending reviews.</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900">{r.product_name}</p>
                      <p className="mt-1 text-sm text-amber-700">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                      {r.body && <p className="mt-2 text-sm text-gray-700">{r.body}</p>}
                      <p className="mt-2 text-xs text-gray-400">
                        {r.user_name}{r.user_email ? ` · ${r.user_email}` : ''}
                        {r.created_at ? ` · ${new Date(r.created_at).toLocaleDateString()}` : ''}
                      </p>
                      {(r.images || []).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {r.images.map((url) => (
                            <img key={url.slice(0, 40)} src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => moderateReview(r.id, 'approve')}
                        className="tap-target inline-flex items-center justify-center gap-1 rounded-xl bg-green-600 px-4 text-sm font-bold text-white disabled:opacity-50"
                      >
                        <Check size={16} /> Approve
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => moderateReview(r.id, 'reject')}
                        className="tap-target inline-flex items-center justify-center gap-1 rounded-xl bg-red-50 px-4 text-sm font-bold text-red-700 disabled:opacity-50"
                      >
                        <X size={16} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {section === 'returns' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Pending returns</h2>
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="animate-spin text-green-600" /></div>
            ) : returns.length === 0 ? (
              <p className="rounded-2xl border border-gray-100 bg-white py-12 text-center text-gray-500">No pending returns.</p>
            ) : (
              returns.map((r) => (
                <div key={r.id} className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{r.product_name}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {r.farm_name} · Qty {r.quantity} · {r.customer_name}
                      </p>
                      <p className="mt-2 text-sm text-gray-700">{r.reason}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => moderateReturn(r.id, 'approve')}
                        className="tap-target rounded-xl bg-green-600 px-4 text-sm font-bold text-white disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => moderateReturn(r.id, 'reject')}
                        className="tap-target rounded-xl bg-red-50 px-4 text-sm font-bold text-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {section === 'blog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">Journal posts</h2>
              <button type="button" onClick={openNewPost} className="tap-target flex items-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-bold text-white">
                <Plus size={16} /> New post
              </button>
            </div>

            {editingPost && (
              <form onSubmit={savePost} className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6">
                <input required placeholder="Title" value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} className="w-full rounded-xl bg-gray-50 p-3" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input placeholder="Slug (optional)" value={postForm.slug} onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })} className="rounded-xl bg-gray-50 p-3" />
                  <input placeholder="Category" value={postForm.category} onChange={(e) => setPostForm({ ...postForm, category: e.target.value })} className="rounded-xl bg-gray-50 p-3" />
                </div>
                <textarea placeholder="Excerpt" rows={2} value={postForm.excerpt} onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })} className="w-full rounded-xl bg-gray-50 p-3" />
                <textarea required placeholder="Body (plain text / light markdown)" rows={10} value={postForm.body} onChange={(e) => setPostForm({ ...postForm, body: e.target.value })} className="w-full rounded-xl bg-gray-50 p-3 font-mono text-sm" />
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={postForm.is_published} onChange={(e) => setPostForm({ ...postForm, is_published: e.target.checked })} />
                  Published
                </label>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingPost(null)} className="tap-target px-4 font-bold text-gray-500">Cancel</button>
                  <button type="submit" disabled={busy} className="tap-target rounded-xl bg-green-600 px-4 font-bold text-white disabled:opacity-50">Save</button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="animate-spin text-green-600" /></div>
            ) : posts.map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4">
                <div>
                  <p className="font-bold text-gray-900">{p.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{p.category} · {p.is_published ? 'Published' : 'Draft'} · /{p.slug}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => openEditPost(p.id)} className="tap-target p-2 text-gray-500 hover:text-green-700" aria-label="Edit">
                    <Pencil size={18} />
                  </button>
                  <button type="button" disabled={busy} onClick={() => deletePost(p.id)} className="tap-target p-2 text-gray-500 hover:text-red-600" aria-label="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {section === 'help' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">Help articles</h2>
              <button type="button" onClick={openNewHelp} className="tap-target flex items-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-bold text-white">
                <Plus size={16} /> New article
              </button>
            </div>

            {editingHelp && (
              <form onSubmit={saveHelp} className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6">
                <input required placeholder="Title" value={helpForm.title} onChange={(e) => setHelpForm({ ...helpForm, title: e.target.value })} className="w-full rounded-xl bg-gray-50 p-3" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input placeholder="Slug (optional)" value={helpForm.slug} onChange={(e) => setHelpForm({ ...helpForm, slug: e.target.value })} className="rounded-xl bg-gray-50 p-3" />
                  <input placeholder="Category" value={helpForm.category} onChange={(e) => setHelpForm({ ...helpForm, category: e.target.value })} className="rounded-xl bg-gray-50 p-3" />
                </div>
                <textarea required placeholder="Body" rows={8} value={helpForm.body} onChange={(e) => setHelpForm({ ...helpForm, body: e.target.value })} className="w-full rounded-xl bg-gray-50 p-3 font-mono text-sm" />
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={helpForm.is_published} onChange={(e) => setHelpForm({ ...helpForm, is_published: e.target.checked })} />
                  Published
                </label>
                {helpForm.slug === 'seller-fees' && (
                  <p className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-800">
                    Fee article — keep unpublished until commission terms are confirmed.
                  </p>
                )}
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingHelp(null)} className="tap-target px-4 font-bold text-gray-500">Cancel</button>
                  <button type="submit" disabled={busy} className="tap-target rounded-xl bg-green-600 px-4 font-bold text-white disabled:opacity-50">Save</button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="animate-spin text-green-600" /></div>
            ) : articles.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4">
                <div>
                  <p className="font-bold text-gray-900">{a.title}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {a.category} · {a.is_published ? 'Published' : 'Draft'}
                    {a.slug === 'seller-fees' && !a.is_published ? ' · awaiting fee decision' : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => openEditHelp(a.id)} className="tap-target p-2 text-gray-500 hover:text-green-700" aria-label="Edit">
                    <Pencil size={18} />
                  </button>
                  <button type="button" disabled={busy} onClick={() => deleteHelp(a.id)} className="tap-target p-2 text-gray-500 hover:text-red-600" aria-label="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {rejectId && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
            <div className="w-full max-w-md space-y-4 rounded-t-3xl bg-white p-5 sm:rounded-3xl sm:p-6">
              <h3 className="text-lg font-bold">Reject application</h3>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Clear reason for the farmer…"
                className="w-full rounded-2xl bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setRejectId(null)} className="tap-target rounded-xl px-4 font-bold text-gray-500">Cancel</button>
                <button type="button" onClick={reject} disabled={busy} className="tap-target rounded-xl bg-red-600 px-4 font-bold text-white disabled:opacity-50">Confirm reject</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
