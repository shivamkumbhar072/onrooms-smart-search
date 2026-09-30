import React from "react";

const Navbar = () => {
  return (
    <div className="relative overflow-hidden bg-black py-6 text-white">
      <div className="marquee-track flex whitespace-nowrap">
        {[0, 1].map((i) => (
          <div key={i} className="flex shrink-0 items-center gap-10 pr-10 text-lg font-medium">
            <span>✦ OnRooms — the AI-powered platform to discover rental accommodation without brokerage</span>
            <span>✦ Find verified PGs, flats & rooms in seconds — no brokers, no hidden fees</span>
            <span>✦ Smart AI matching for your budget, location & preferences</span>
          </div>
        ))}
      </div>

      <style>{`
        .marquee-track {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Navbar;