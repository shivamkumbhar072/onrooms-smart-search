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
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          ✦ How it works
        </span>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Find the right PG in 3 simple steps
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
            className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 text-center transition hover:border-gray-300 hover:shadow-md"
          >
            {/* Number badge */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700">
              {step.number}
            </div>

            {/* Title */}
            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              {step.title}
            </h3>

            {/* Description */}
            <p className="mt-3 text-sm leading-6 text-gray-500">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;