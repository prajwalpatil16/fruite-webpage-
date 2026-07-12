import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const image = product.image_url || product.image;
  const farmer = product.farmer_name || product.farmer || 'FruitBasket farm';

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={image}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000';
          }}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {product.is_new_seller && (
            <span className="rounded-md bg-amber-500 px-2 py-1 text-[10px] font-bold text-white">
              New Seller
            </span>
          )}
          {product.featureTag && (
            <span className="rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold text-white">
              {product.featureTag}
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        className="tap-target absolute right-2 top-2 z-10 flex items-center justify-center rounded-full bg-white/95 text-gray-400 shadow-sm"
        aria-label="Wishlist coming soon"
      >
        <Heart size={18} />
      </button>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition-colors hover:text-green-700 sm:text-base">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 truncate text-xs text-gray-400">From {farmer}</p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-50 pt-3">
          <div>
            <span className="text-lg font-extrabold text-gray-900 sm:text-xl">₹{product.price}</span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              per {product.unit || 'unit'}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="tap-target flex items-center justify-center rounded-xl bg-green-50 text-green-700 transition hover:bg-green-600 hover:text-white"
            aria-label="Add to basket"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
