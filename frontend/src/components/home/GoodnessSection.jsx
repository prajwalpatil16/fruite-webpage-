const items = [
  {
    title: "Juicy, Sweet & Healthy",
    text: "Fresh fruits packed with natural sweetness and nutrients."
  },
  {
    title: "A Taste of Nature",
    text: "Enjoy produce grown using sustainable farming practices."
  },
  {
    title: "The Perfect Snack",
    text: "Healthy, refreshing, and perfect for any time of the day."
  }
];

export default function GoodnessSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-2xl font-bold mb-10">
        Your Daily Dose of Goodness
      </h2>

      <div className="grid md:grid-cols-3 gap-10">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="h-40 bg-gray-100 rounded mb-4"></div>
            <h4 className="font-semibold mb-2">{item.title}</h4>
            <p className="text-gray-600 text-sm">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
