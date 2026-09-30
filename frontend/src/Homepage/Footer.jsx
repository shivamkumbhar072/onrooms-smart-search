import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-6 text-center">

        {/* Small badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-gray-300">
          ✦ OnRooms
        </div>

        {/* Big statement */}
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          <span className="block text-blue-400">
            Prioritizing Every stay...
          </span>
        </h2>

        {/* Sub-line */}
        <p className="mx-auto mt-6 max-w-2xl text-base text-gray-400 sm:text-lg">
          OnRooms is the AI-powered platform to discover PGs, flats & rooms
          without brokerage. Just describe what you need — we handle the rest.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://onrooms.in"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Explore onrooms.in →
          </a>

          <a
            href="#search"
            className="cursor-pointer rounded-xl border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Find a PG with AI
          </a>
        </div>

        {/* Bottom strip */}
        <div className="mt-16 flex flex-col items-center gap-3 border-t border-white/10 pt-8 text-xs text-gray-500 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} OnRooms. All rights reserved.</span>

          <a
            href="https://onrooms.in"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-gray-300"
          >
            onrooms.in
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;