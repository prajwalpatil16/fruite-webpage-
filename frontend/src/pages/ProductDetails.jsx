import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, MapPin, Loader2, Sprout } from 'lucide-react';
import { api } from '../api';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [slide, setSlide] = useState(0);
  const scrollerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      const { ok, data } = await api(`/api/products/${id}`);
      if (cancelled) return;
      if (ok) setProduct(data);
      else setError(data?.msg || 'This product is no longer available.');
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAdd = async () => {
    if (!product) return;
    setAdding(true);
    await addToCart(product);
    setAdding(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="mb-3 text-2xl font-bold text-gray-900">Product not found</h1>
        <p className="mb-6 text-gray-500">{error || 'It may have sold out or left the market.'}</p>
        <Link to="/marketplace" className="font-bold text-green-700 hover:underline">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const farm = product.farmer_profile;
  const inStock = product.stock_quantity > 0;
  const images = [
    product.image_url,
    ...(product.gallery_urls || []),
  ].filter(Boolean);
  if (images.length === 0) {
    images.push(
      'https://images.unsplash.com/photo-1619566633748-5d8de0d59248?auto=format&fit=crop&q=80&w=800'
    );
  }

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setSlide(idx);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans sm:pb-10 sm:py-10">
      <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
        <Link
          to="/marketplace"
          className="tap-target mx-4 mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 sm:mx-0 sm:mb-6"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="overflow-hidden bg-white sm:rounded-3xl sm:border sm:border-gray-100 sm:shadow-sm lg:grid lg:grid-cols-2">
          {/* Swipeable gallery (scroll-snap) */}
          <div className="relative bg-gray-100">
            <div
              ref={scrollerRef}
              onScroll={onScroll}
              className="flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto hide-scrollbar sm:aspect-square"
            >
              {images.map((src, i) => (
                <div key={i} className="h-full w-full shrink-0 snap-center">
                  <img
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Image ${i + 1}`}
                    onClick={() => {
                      scrollerRef.current?.scrollTo({
                        left: i * (scrollerRef.current?.clientWidth || 0),
                        behavior: 'smooth',
                      });
                    }}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      slide === i ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
            {/* Desktop thumbnails when multiple */}
            {images.length > 1 && (
              <div className="hidden gap-2 p-3 sm:flex">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      scrollerRef.current?.scrollTo({
                        left: i * (scrollerRef.current?.clientWidth || 0),
                        behavior: 'smooth',
                      });
                    }}
                    className={`h-16 w-16 overflow-hidden rounded-xl border-2 ${
                      slide === i ? 'border-green-600' : 'border-transparent'
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col p-5 sm:p-8 lg:p-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-green-700">
              {product.category_name || 'Fresh produce'}
            </p>
            <h1 className="mb-3 text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
              {product.name}
            </h1>
            <p className="mb-5 text-sm leading-relaxed text-gray-600 sm:text-base">
              {product.description || 'Fresh from the farm, packed for your table.'}
            </p>

            <div className="mb-4 flex items-end gap-2">
              <span className="text-3xl font-black text-green-700">₹{product.price}</span>
              <span className="pb-1 text-sm font-medium text-gray-500">/ {product.unit || 'unit'}</span>
            </div>

            <p className={`mb-6 text-sm font-bold ${inStock ? 'text-gray-700' : 'text-red-600'}`}>
              {inStock
                ? `${product.stock_quantity} in stock — sold this week from the farm`
                : 'Currently out of stock'}
            </p>

            {farm && (
              <Link
                to={`/farmers?highlight=${farm.id}`}
                className="mb-6 flex min-h-[44px] items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 transition hover:bg-green-100/60"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white">
                  {farm.photo_url ? (
                    <img src={farm.photo_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-green-700">
                      <Sprout size={22} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-green-700">Grown by</p>
                  <p className="font-bold text-gray-900">{farm.farm_name}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={12} /> {farm.location}
                  </p>
                </div>
              </Link>
            )}

            <button
              type="button"
              onClick={handleAdd}
              disabled={adding || !inStock}
              className="tap-target mt-auto hidden w-full items-center justify-center gap-2 rounded-2xl bg-green-600 text-sm font-bold text-white shadow-lg shadow-green-600/20 disabled:opacity-50 sm:flex"
            >
              {adding ? <Loader2 className="animate-spin" /> : <ShoppingCart size={20} />}
              {!inStock ? 'Out of stock' : 'Add to basket'}
            </button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-gray-900">{product.name}</p>
            <p className="text-base font-black text-green-700">₹{product.price}</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding || !inStock}
            className="tap-target flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-bold text-white disabled:opacity-50"
          >
            {adding ? <Loader2 className="animate-spin" size={18} /> : <ShoppingCart size={18} />}
            {!inStock ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
