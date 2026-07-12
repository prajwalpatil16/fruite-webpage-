import React from 'react';

/**
 * Editorial origin narrative — display type + pull-quote, not another card grid.
 * Static copy (CMS not worth it for one story block).
 */
const OurStory = () => (
  <section className="relative overflow-hidden bg-[#f7f3eb] py-12 sm:py-16">
    <div
      className="pointer-events-none absolute -right-16 top-8 h-56 w-56 rounded-full bg-[#c8d9c4]/40 blur-2xl"
      aria-hidden
    />
    <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:px-8">
      <div className="lg:pt-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1f6b3a]">
          Our story
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#3d2f24] sm:text-4xl">
          Why we started FruitBasket
        </h2>
        <blockquote className="mt-6 border-l-4 border-[#1f6b3a] pl-4 font-display text-xl font-medium leading-snug text-[#3d2f24] sm:text-2xl">
          Why does a tomato cost this much, taste like this little, and travel this far —
          when there are farms twenty minutes away?
        </blockquote>
      </div>
      <div className="space-y-4 text-[0.95rem] leading-relaxed text-[#4a4038] sm:text-base sm:leading-[1.75]">
        <p>
          We didn&apos;t start FruitBasket because we saw a market opportunity. We started it
          because we kept asking that same question at every grocery run.
        </p>
        <p>
          The answer, it turned out, wasn&apos;t the farmers. It was everything standing between
          them and us — layers of distributors and markups that left farmers with a fraction of
          what we were paying, and left us with produce that had been picked before it was ready,
          just to survive the trip.
        </p>
        <p>
          FruitBasket is our attempt to remove those layers. Not a mission statement — an actual
          different way of buying food. Farmers set their own prices. You see exactly whose farm
          it came from. And a tomato tastes like a tomato again.
        </p>
        <p className="pt-1 text-sm font-medium italic text-[#6b5e52]">— The FruitBasket team</p>
      </div>
    </div>
  </section>
);

export default OurStory;
