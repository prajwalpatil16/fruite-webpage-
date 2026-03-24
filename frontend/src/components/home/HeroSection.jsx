export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-green-50 to-white overflow-hidden">
      
      {/* subtle background accent */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-60" />

      <div className="relative max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm font-medium text-green-700 mb-3 tracking-wide">
            DIRECT FROM FARMERS
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gray-900">
            Taste the Goodness of Nature,
            <br />
            <span className="text-green-600">Delivered Fresh</span>
          </h1>

          <p className="text-gray-600 mb-10 max-w-lg leading-relaxed">
            Farm-fresh fruits sourced directly from real farmers —
            ensuring fair prices, complete transparency, and
            uncompromised freshness at your doorstep.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition">
              Shop Fresh Fruits
            </button>

            <button className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
              Meet Our Farmers
            </button>
          </div>

          {/* trust indicators */}
          <div className="flex gap-6 mt-10 text-sm text-gray-500">
            <span>🌱 Fair for farmers</span>
            <span>🍎 Fresh harvest</span>
            <span>🚚 Direct delivery</span>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="hidden md:block">
          <div className="relative h-[440px] rounded-2xl bg-green-100 overflow-hidden shadow-sm">
            
            {/* placeholder that feels intentional */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-green-700">
              <div className="text-lg font-semibold mb-2">
                Farmer → Consumer
              </div>
              <p className="text-sm opacity-80">
                Fresh produce journey
              </p>
            </div>

            {/* subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-green-200/40 to-transparent" />
          </div>
        </div>

      </div>
    </section>
  );
}
