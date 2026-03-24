const items = [
  {
    title: "The Perfect Loaf",
    text: "Understand the science behind baking fresh and healthy bread."
  },
  {
    title: "Sweet Treats",
    text: "Bake delicious desserts using natural fruit ingredients."
  }
];

export default function BakingSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-2xl font-bold mb-10">
        The Art of Baking
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-56 bg-gray-200"></div>
            <div className="p-6">
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
