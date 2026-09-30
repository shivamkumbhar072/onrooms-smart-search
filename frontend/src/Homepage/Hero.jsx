import { useState, useRef } from "react";

import Results from "./Results";
import HowItWorks from "./HowItWorks";

const API_URL = "http://127.0.0.1:8000";

function Hero() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const resultsRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setLoading(true);
    setError("");
    setResults([]);
    setHasSearched(true);

    // Scroll down to results, offset for sticky marquee
    setTimeout(() => {
      if (resultsRef.current) {
        const offset = 96; // sticky marquee height + generous gap
        const top =
          resultsRef.current.getBoundingClientRect().top +
          window.scrollY -
          offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100);

    try {
      const response = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmedQuery, k: 5 }),
      });

      if (!response.ok) throw new Error("Search request failed");

      const data = await response.json();
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Unable to search right now. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const useExample = (example) => {
    setQuery(example);
    setError("");
    setHasSearched(false);
    setResults([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tryAgain = () => {
    setQuery("");
    setHasSearched(false);
    setResults([]);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated brownish-red background */}
      <div className="animated-bg absolute inset-0 -z-10" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grain" />
      </div>

      {/* Hero Section */}
      <section
        id="search"
        className="relative flex min-h-[85vh] items-center justify-center px-6 pb-24 pt-32 sm:pt-36"
      >
        <div className="mx-auto w-full max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-medium tracking-wide text-white backdrop-blur">
            ✦ AI-Powered PG Finder
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
            Find your perfect
            <span className="mt-2 block bg-gradient-to-r from-amber-200 via-orange-300 to-red-300 bg-clip-text text-transparent">
              PG with OnRooms AI
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-2xl text-base text-white/80 sm:text-lg">
            Tell us what you're looking for in your own words.
            OnRooms AI will find PGs that match your requirements.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-12 flex max-w-3xl items-center gap-2 rounded-2xl border border-white/20 bg-white/95 p-2 shadow-xl backdrop-blur transition focus-within:border-white/40 focus-within:shadow-2xl"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: Boys PG near Pimpri under ₹9,000 with food and WiFi"
              disabled={loading}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-gray-900 placeholder-gray-400 outline-none disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="shrink-0 cursor-pointer rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Examples */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-white/70">Try:</span>

            <button
              type="button"
              onClick={() =>
                useExample(
                  "Boys PG near Pimpri under ₹9,000 with food and WiFi"
                )
              }
              className="cursor-pointer rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-white backdrop-blur transition hover:border-white/40 hover:bg-white/20"
            >
              Boys PG near Pimpri
            </button>

            <button
              type="button"
              onClick={() =>
                useExample("Girls PG near Hinjewadi under ₹10,000 with AC")
              }
              className="cursor-pointer rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-white backdrop-blur transition hover:border-white/40 hover:bg-white/20"
            >
              Girls PG near Hinjewadi
            </button>

            <button
              type="button"
              onClick={() =>
                useExample("Double sharing PG with food and WiFi under ₹8,000")
              }
              className="cursor-pointer rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-white backdrop-blur transition hover:border-white/40 hover:bg-white/20"
            >
              Double sharing with food
            </button>
          </div>
        </div>
      </section>

      {/* Scroll target for results / loading / error */}
      <div ref={resultsRef} className="scroll-mt-28" />

      {/* Loading */}
      {loading && (
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          <p className="text-sm text-white/80 sm:text-base">
            Finding PGs that match your requirements...
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="relative mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-xl border border-red-200/40 bg-red-500/20 p-5 text-center text-sm text-white backdrop-blur sm:text-base">
            {error}
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && !loading && !error && (
        <div className="relative rounded-t-3xl bg-white pt-12 pb-4">
          <Results results={results} tryAgain={tryAgain} />
        </div>
      )}

      {/* Homepage sections */}
      {!hasSearched && (
        <div className="relative rounded-t-3xl bg-white pt-12 pb-4">
          <HowItWorks />
        </div>
      )}

      {/* ===== Animated background styles ===== */}
      <style>{`
        .animated-bg {
          background:
            radial-gradient(circle at 20% 20%, #4a1d1d 0%, transparent 55%),
            radial-gradient(circle at 80% 30%, #7c2d12 0%, transparent 50%),
            radial-gradient(circle at 50% 90%, #991b1b 0%, transparent 55%),
            linear-gradient(135deg, #1a0e0a 0%, #3b1a14 50%, #2a0f0f 100%);
        }

        .blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(80px);
          opacity: 0.55;
          mix-blend-mode: screen;
          will-change: transform;
        }

        .blob-1 {
          width: 500px;
          height: 500px;
          top: -120px;
          left: -120px;
          background: radial-gradient(circle, #b45309 0%, transparent 70%);
          animation: float1 18s ease-in-out infinite;
        }

        .blob-2 {
          width: 550px;
          height: 550px;
          bottom: -150px;
          right: -120px;
          background: radial-gradient(circle, #b91c1c 0%, transparent 70%);
          animation: float2 22s ease-in-out infinite;
        }

        .blob-3 {
          width: 400px;
          height: 400px;
          top: 40%;
          left: 45%;
          background: radial-gradient(circle, #7f1d1d 0%, transparent 70%);
          animation: float3 26s ease-in-out infinite;
        }

        .grain {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 3px 3px;
          opacity: 0.25;
          pointer-events: none;
        }

        @keyframes float1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(120px, 80px) scale(1.15); }
        }
        @keyframes float2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(-140px, -60px) scale(1.1); }
        }
        @keyframes float3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(-80px, 100px) scale(1.2); }
        }

        @media (prefers-reduced-motion: reduce) {
          .blob { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default Hero;