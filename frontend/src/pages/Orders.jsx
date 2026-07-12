import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, Loader2, Star, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { api } from '../api';

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const Orders = () => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [returnTarget, setReturnTarget] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, body: '', image: null });
  const [returnForm, setReturnForm] = useState({ quantity: 1, reason: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formOk, setFormOk] = useState('');

  useEffect(() => {
    if (!token) return;
    const fetchOrders = async () => {
      const { ok, data } = await api('/api/orders', { token });
      if (ok) setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, [token]);

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'delivered':
      case 'fulfilled':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'out_for_delivery':
      case 'partially_fulfilled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'packed':
      case 'confirmed':
      case 'placed':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'delivered':
      case 'fulfilled':
        return <CheckCircle size={14} />;
      case 'out_for_delivery':
      case 'partially_fulfilled':
        return <Truck size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const labelStatus = (s) => (s || '').replace(/_/g, ' ');

  const canActOnItem = (groupStatus, orderStatus) => {
    const s = (groupStatus || orderStatus || '').toLowerCase();
    return s && s !== 'cancelled';
  };

  const openReview = (item, order) => {
    setFormError('');
    setFormOk('');
    setReviewForm({ rating: 5, body: '', image: null });
    setReviewTarget({ item, order });
  };

  const openReturn = (item) => {
    setFormError('');
    setFormOk('');
    setReturnForm({ quantity: item.quantity || 1, reason: '' });
    setReturnTarget(item);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewTarget) return;
    setSubmitting(true);
    setFormError('');
    const images = [];
    if (reviewForm.image) {
      try {
        const url = await fileToDataUrl(reviewForm.image);
        if (url) images.push(url);
      } catch {
        setFormError('Could not read photo');
        setSubmitting(false);
        return;
      }
    }
    const { ok, data } = await api('/api/reviews', {
      method: 'POST',
      token,
      body: {
        product_id: reviewTarget.item.product_id || reviewTarget.item.product?.id,
        order_id: reviewTarget.order.id,
        rating: reviewForm.rating,
        body: reviewForm.body,
        images,
      },
    });
    setSubmitting(false);
    if (ok) {
      setFormOk(data?.msg || 'Review submitted');
      setTimeout(() => setReviewTarget(null), 900);
    } else {
      setFormError(data?.msg || 'Could not submit review');
    }
  };

  const submitReturn = async (e) => {
    e.preventDefault();
    if (!returnTarget) return;
    setSubmitting(true);
    setFormError('');
    const { ok, data } = await api('/api/returns', {
      method: 'POST',
      token,
      body: {
        order_item_id: returnTarget.id,
        quantity: parseInt(returnForm.quantity, 10) || 1,
        reason: returnForm.reason.trim(),
      },
    });
    setSubmitting(false);
    if (ok) {
      setFormOk(data?.msg || 'Return requested');
      setTimeout(() => setReturnTarget(null), 900);
    } else {
      setFormError(data?.msg || 'Could not request return');
    }
  };

  const renderItemActions = (item, order, groupStatus) => {
    if (!canActOnItem(groupStatus, order.status)) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => openReview(item, order)}
          className="tap-target inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 text-xs font-bold text-amber-800"
        >
          <Star size={14} /> Review
        </button>
        <button
          type="button"
          onClick={() => openReturn(item)}
          className="tap-target inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 text-xs font-bold text-green-800"
        >
          <RotateCcw size={14} /> Request return
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 font-sans sm:py-10 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-1 flex items-center gap-2 text-2xl font-extrabold text-gray-900 sm:mb-2 sm:text-3xl">
          <Package className="text-green-600" size={26} /> My Orders
        </h1>
        <p className="mb-6 text-sm text-gray-500 sm:mb-8">
          One purchase, clear farm groups. Review items or request a return from here.
        </p>

        <div className="space-y-5 sm:space-y-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-green-600" size={48} />
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center">
              <p className="mb-2 text-lg font-bold text-gray-800">No orders yet</p>
              <p className="mx-auto max-w-md px-4 font-medium text-gray-500">
                When you check out, your basket is sent to the farms who grew what you bought — not a warehouse.
              </p>
              <Link to="/marketplace" className="tap-target mt-6 inline-flex items-center font-bold text-green-700 hover:underline">
                Browse the marketplace
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/80 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-6">
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Order placed</p>
                      <p className="text-sm font-bold text-gray-700">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total</p>
                      <p className="text-sm font-bold text-gray-700">₹{order.total_price}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Ship to</p>
                      <p className="text-sm font-bold text-gray-700">{user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Order # FB-{order.order_id || order.id}
                    </p>
                    <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {labelStatus(order.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
                  {(order.farmer_groups || []).length > 0 ? (
                    order.farmer_groups.map((group) => (
                      <div
                        key={group.farmer_order_id}
                        className="rounded-2xl border border-green-100 bg-green-50/40 p-3 sm:p-4"
                      >
                        <div className="mb-3 flex flex-col gap-2 border-b border-green-100/80 pb-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                          <p className="text-sm font-bold leading-snug text-gray-900">
                            From: {group.farm_name}
                            <span className="mt-0.5 block text-xs font-medium text-gray-500 sm:mt-0 sm:ml-1 sm:inline">
                              · {group.items?.length || 0} item{(group.items?.length || 0) === 1 ? '' : 's'}
                            </span>
                          </p>
                          <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${getStatusColor(group.status)}`}>
                            {labelStatus(group.status)} · ₹{group.subtotal}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {(group.items || []).map((item) => (
                            <div key={item.id} className="flex items-start gap-3 sm:gap-4">
                              <img
                                src={item.product?.image_url || 'https://via.placeholder.com/150'}
                                alt={item.product?.name}
                                loading="lazy"
                                className="h-14 w-14 shrink-0 rounded-xl bg-white object-cover sm:h-20 sm:w-20"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                                  {item.product?.name}
                                </h4>
                                <p className="mt-0.5 text-xs font-semibold text-gray-500">
                                  Qty {item.quantity} × ₹{item.price_at_purchase}
                                </p>
                                {renderItemActions(item, order, group.status)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    (order.items || []).map((item) => (
                      <div key={item.id} className="flex items-start gap-3 sm:gap-4">
                        <img
                          src={item.product?.image_url || 'https://via.placeholder.com/150'}
                          alt={item.product?.name}
                          loading="lazy"
                          className="h-14 w-14 rounded-xl bg-gray-50 object-cover sm:h-16 sm:w-16"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900">{item.product?.name}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price_at_purchase}</p>
                          {renderItemActions(item, order, order.status)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <form
            onSubmit={submitReview}
            className="w-full max-w-md space-y-4 rounded-t-3xl bg-white p-5 sm:rounded-3xl sm:p-6"
          >
            <h3 className="text-lg font-bold text-gray-900">
              Review {reviewTarget.item.product?.name || 'product'}
            </h3>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                    className="tap-target p-1"
                    aria-label={`${n} stars`}
                  >
                    <Star
                      size={28}
                      className={n <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={4}
              value={reviewForm.body}
              onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
              placeholder="How was the produce?"
              className="w-full rounded-2xl bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-green-500"
            />
            <label className="tap-target flex cursor-pointer flex-col justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 text-sm font-medium text-gray-600">
              <span>{reviewForm.image ? reviewForm.image.name : 'Optional photo'}</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => setReviewForm({ ...reviewForm, image: e.target.files?.[0] || null })}
              />
            </label>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            {formOk && <p className="text-sm text-green-700">{formOk}</p>}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setReviewTarget(null)} className="tap-target rounded-xl px-4 font-bold text-gray-500">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="tap-target rounded-xl bg-green-600 px-4 font-bold text-white disabled:opacity-50">
                {submitting ? 'Sending…' : 'Submit review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {returnTarget && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <form
            onSubmit={submitReturn}
            className="w-full max-w-md space-y-4 rounded-t-3xl bg-white p-5 sm:rounded-3xl sm:p-6"
          >
            <h3 className="text-lg font-bold text-gray-900">
              Return {returnTarget.product?.name || 'item'}
            </h3>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">Quantity</label>
              <input
                type="number"
                min={1}
                max={returnTarget.quantity || 1}
                required
                value={returnForm.quantity}
                onChange={(e) => setReturnForm({ ...returnForm, quantity: e.target.value })}
                className="tap-target w-full rounded-xl bg-gray-50 px-3"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">Reason</label>
              <textarea
                rows={4}
                required
                value={returnForm.reason}
                onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                placeholder="What was wrong?"
                className="w-full rounded-2xl bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            {formOk && <p className="text-sm text-green-700">{formOk}</p>}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setReturnTarget(null)} className="tap-target rounded-xl px-4 font-bold text-gray-500">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="tap-target rounded-xl bg-green-600 px-4 font-bold text-white disabled:opacity-50">
                {submitting ? 'Sending…' : 'Request return'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Orders;
