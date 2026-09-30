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

    if (!trimmedQuery) {
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setHasSearched(true);

    // Scroll to results section right away (loading state)
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    try {
      const response = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: trimmedQuery,
          k: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();

      setResults(
        Array.isArray(data.results) ? data.results : []
      );
    } catch (err) {
      console.error("Search failed:", err);

      setError(
        "Unable to search right now. Please try again."
      );

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
  };

  const tryAgain = () => {
    setQuery("");
    setHasSearched(false);
    setResults([]);
    setError("");
  };

  return (
    <>
      {/* Hero Section */}
      <section
        id="search"
        className="flex min-h-[80vh] items-center justify-center px-6 py-6"
      >
        <div className="mx-auto w-full max-w-4xl text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-medium tracking-wide text-gray-700">
            ✦ AI-Powered PG Finder
          </div>

<h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
  Find your perfect
  <span className="mt-1 block text-blue-600">
    PG with OnRooms AI
  </span>
</h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-600 sm:text-lg">
            Tell us what you're looking for in your own words.
            OnRooms AI will find PGs that match your requirements.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex max-w-3xl items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-gray-400 focus-within:shadow-md transition"
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
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-gray-500">
              Try:
            </span>

            <button
              type="button"
              onClick={() =>
                useExample(
                  "Boys PG near Pimpri under ₹9,000 with food and WiFi"
                )
              }
              className="cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-1.5 text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Boys PG near Pimpri
            </button>

            <button
              type="button"
              onClick={() =>
                useExample(
                  "Girls PG near Hinjewadi under ₹10,000 with AC"
                )
              }
              className="cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-1.5 text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Girls PG near Hinjewadi
            </button>

            <button
              type="button"
              onClick={() =>
                useExample(
                  "Double sharing PG with food and WiFi under ₹8,000"
                )
              }
              className="cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-1.5 text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Double sharing with food
            </button>
          </div>
        </div>
      </section>

      {/* Scroll target for results / loading / error */}
      <div ref={resultsRef} className="scroll-mt-4" />

      {/* Loading */}
      {loading && (
        <div className="mx-auto max-w-7xl px-6 py-10 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="text-sm text-gray-600 sm:text-base">
            Finding PGs that match your requirements...
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="mx-auto max-w-3xl px-6 py-6">
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm text-red-600 sm:text-base">
            {error}
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && !loading && !error && (
        <Results
          results={results}
          tryAgain={tryAgain}
        />
      )}

      {/* Homepage sections */}
      {!hasSearched && (
        <>
          <HowItWorks />
        </>
      )}
    </>
  );
}

export default Hero;