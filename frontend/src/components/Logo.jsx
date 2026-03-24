export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Mark */}
      <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
        <span className="text-white font-bold text-lg">NB</span>
      </div>

      {/* Brand Text */}
      <div className="leading-tight">
        <p className="text-lg font-semibold text-gray-900">
          Nature’s Basket
        </p>
        <p className="text-xs text-gray-500 tracking-wide">
          From farmers to you
        </p>
      </div>
    </div>
  );
}
