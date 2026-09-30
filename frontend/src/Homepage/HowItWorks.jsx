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
    <section className="mx-auto max-w-7xl px-6 py-20">
      {/* Header */}
      <div className="mb-12">
        <span className="text-sm font-semibold tracking-wider text-blue-600">
          HOW IT WORKS
        </span>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Find the right PG in 3 simple steps
        </h2>

        <p className="mt-3 max-w-2xl text-gray-500">
          Tell us what you're looking for and let AI find suitable
          accommodation options for you.
        </p>
      </div>

      {/* Steps */}
      <div className="divide-y divide-gray-200 border-y border-gray-200">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex gap-6 py-8 transition hover:bg-gray-50"
          >
            {/* Number */}
            <div className="w-12 shrink-0 text-sm font-semibold text-gray-400">
              {step.number}
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {step.title}
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;