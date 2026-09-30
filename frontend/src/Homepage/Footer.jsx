import React from "react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* Warm brownish-red gradient background */}
      <div className="footer-bg absolute inset-0 -z-10" aria-hidden="true">
        <div className="footer-blob footer-blob-1" />
        <div className="footer-blob footer-blob-2" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-16 text-center">

        {/* Small badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 backdrop-blur">
          ✦ OnRooms
        </div>

        {/* Big statement */}
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Prioritizing every stay,
          <span className="mt-1 block bg-gradient-to-r from-amber-200 via-orange-300 to-red-300 bg-clip-text text-transparent">
            one search at a time.
          </span>
        </h2>

        {/* Sub-line */}
        <p className="mx-auto mt-6 max-w-2xl text-base text-white/75 sm:text-lg">
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
            className="cursor-pointer rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:border-white/40 hover:bg-white/15"
          >
            Find a PG with AI
          </a>
        </div>

        {/* Bottom strip */}
        <div className="mt-16 flex flex-col items-center gap-3 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} OnRooms. All rights reserved.</span>

          <a
            href="https://onrooms.in"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white/80"
          >
            onrooms.in
          </a>
        </div>
      </div>

      {/* ===== Footer background styles ===== */}
      <style>{`
        .footer-bg {
          background:
            radial-gradient(circle at 20% 0%, #4a1d1d 0%, transparent 55%),
            radial-gradient(circle at 85% 100%, #7c2d12 0%, transparent 55%),
            radial-gradient(circle at 50% 50%, #991b1b 0%, transparent 60%),
            linear-gradient(180deg, #1a0e0a 0%, #2a0f0f 100%);
        }

        .footer-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(90px);
          opacity: 0.5;
          mix-blend-mode: screen;
          will-change: transform;
        }

        .footer-blob-1 {
          width: 450px;
          height: 450px;
          top: -100px;
          left: -100px;
          background: radial-gradient(circle, #b45309 0%, transparent 70%);
          animation: footerFloat1 20s ease-in-out infinite;
        }

        .footer-blob-2 {
          width: 500px;
          height: 500px;
          bottom: -150px;
          right: -120px;
          background: radial-gradient(circle, #b91c1c 0%, transparent 70%);
          animation: footerFloat2 24s ease-in-out infinite;
        }

        @keyframes footerFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(80px, 60px) scale(1.12); }
        }
        @keyframes footerFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(-100px, -50px) scale(1.1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-blob { animation: none; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;