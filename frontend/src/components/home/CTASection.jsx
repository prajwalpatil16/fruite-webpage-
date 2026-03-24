export default function CTASection() {
  return (
    <section className="bg-green-600">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between text-white">
        
        <h2 className="text-2xl font-bold mb-6 md:mb-0">
          You Decide Your Health
        </h2>

        <div className="flex gap-4">
          <button className="bg-white text-green-700 px-6 py-3 rounded">
            Get Started
          </button>
          <button className="border border-white px-6 py-3 rounded">
            About Us
          </button>
        </div>

      </div>
    </section>
  );
}
