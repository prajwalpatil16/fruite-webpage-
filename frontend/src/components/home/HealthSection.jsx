export default function HealthSection() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        
        <div>
          <h2 className="text-3xl font-bold mb-6">
            A Foundation for a Fulfilling Life
          </h2>

          <p className="text-gray-600 mb-4">
            A balanced diet rich in fruits supports immunity,
            energy, and long-term well-being.
          </p>

          <p className="text-gray-600 mb-8">
            We help you make healthier choices by connecting you
            directly with trusted farmers.
          </p>

          <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
            Learn About Health
          </button>
        </div>

        <div className="hidden md:block">
          <div className="h-[360px] bg-gray-200 rounded-xl flex items-center justify-center">
            Health Image
          </div>
        </div>

      </div>
    </section>
  );
}
