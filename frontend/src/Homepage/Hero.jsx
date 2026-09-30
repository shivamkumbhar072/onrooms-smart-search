import { useState } from "react";

import Results from "./Results";
import Features from "./Features";
import HowItWorks from "./HowItWorks";

// const API_URL = "http://127.0.0.1:8000";
 const API_URL = "https://onrooms-smart-search.vercel.app"

function Hero() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

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

      console.log("AI Search Response:", data);

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
        className="flex min-h-[80vh] items-center justify-center px-6 py-20"
      >
        <div className="mx-auto w-full max-w-4xl text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
            ✦ AI-Powered PG Finder
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Find your perfect
            <span className="block text-blue-600">
              PG with AI
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Tell us what you're looking for in your own words.
            OnRooms AI will find PGs that match your requirements.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-lg"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: Boys PG near Pimpri under ₹9,000 with food and WiFi"
              disabled={loading}
              className="min-w-0 flex-1 px-4 py-3 text-gray-900 outline-none"
            />

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Examples */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
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
              className="rounded-full bg-gray-100 px-4 py-2 transition hover:bg-gray-200"
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
              className="rounded-full bg-gray-100 px-4 py-2 transition hover:bg-gray-200"
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
              className="rounded-full bg-gray-100 px-4 py-2 transition hover:bg-gray-200"
            >
              Double sharing with food
            </button>
          </div>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="mx-auto max-w-7xl px-6 py-10 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="text-gray-600">
            Finding PGs that match your requirements...
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="mx-auto max-w-3xl px-6 py-6">
          <div className="rounded-xl bg-red-50 p-4 text-center text-red-600">
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
          <Features />
          <HowItWorks />
        </>
      )}
    </>
  );
}

export default Hero;