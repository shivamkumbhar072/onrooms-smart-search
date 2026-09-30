import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Tell us what you need",
      description:
        "Enter your preferred location, budget, gender, occupancy, and other requirements.",
    },
    {
      number: "02",
      title: "AI finds suitable PGs",
      description:
        "Our AI analyzes your requirements and finds PGs that match your preferences.",
    },
    {
      number: "03",
      title: "Get your recommendations",
      description:
        "View the most relevant PG options with details like price, location, and amenities.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl px-6 py-20"
    >
      {/* Header */}
      <div className="mb-14 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-red-700">
          ✦ How it works
        </span>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Find the right PG in{" "}
          <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 bg-clip-text text-transparent">
            3 simple steps
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
          Tell us what you're looking for and let AI find suitable
          accommodation options for you.
        </p>
      </div>

      {/* Steps */}
      <div className="grid gap-6 sm:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-b from-white to-orange-50/40 p-8 text-center transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg hover:shadow-red-900/10"
          >
            {/* Warm glow accent on hover */}
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-300/30 to-red-400/30 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            {/* Number badge */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 text-sm font-semibold text-white shadow-md shadow-red-900/20">
              {step.number}
            </div>

            {/* Title */}
            <h3 className="relative mt-5 text-lg font-semibold text-gray-900">
              {step.title}
            </h3>

            {/* Description */}
            <p className="relative mt-3 text-sm leading-6 text-gray-600">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;