const Results = ({ results, tryAgain }) => {
  return (
    <section
      id="recommendations"
      className="mx-auto max-w-7xl px-6 py-20"
    >
      {results.length > 0 ? (
        <>
          {/* Header */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold tracking-wider text-blue-600">
                AI RESULTS
              </span>

              <h2 className="mt-2 text-3xl font-bold">
                Recommended PGs
              </h2>
            </div>

            <span className="text-gray-500">
              {results.length}{" "}
              {results.length === 1 ? "match" : "matches"}
            </span>
          </div>

          {/* Results */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((pg) => (
              <div
                key={pg.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="flex h-48 items-center justify-center bg-gray-100 text-5xl">
                  🏠
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                      {pg.gender}
                    </span>

                    <span className="text-sm text-gray-400">
                      #{pg.id}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold">
                    {pg.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    📍 {pg.area}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      👤 {pg.occupancy}
                    </span>

                    {pg.price !== undefined &&
                      pg.price !== null && (
                        <span className="font-semibold text-gray-900">
                          ₹
                          {Number(pg.price).toLocaleString("en-IN")}
                          <span className="font-normal text-gray-500">
                            /month
                          </span>
                        </span>
                      )}
                  </div>

                  {/* Amenities */}
                  {pg.amenities?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {pg.amenities
                        .slice(0, 3)
                        .map((amenity) => (
                          <span
                            key={amenity}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                          >
                            {amenity}
                          </span>
                        ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="mt-6 w-full rounded-xl bg-black py-3 font-medium text-white transition hover:bg-gray-800"
                  >
                    View PG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* No Results */
        <div className="mx-auto max-w-xl py-20 text-center">
          <div className="text-5xl">
            🔎
          </div>

          <h2 className="mt-6 text-3xl font-bold">
            No PGs found
          </h2>

          <p className="mt-3 text-gray-600">
            We couldn't find any PGs matching your requirements.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Try increasing your budget, changing the location,
            or removing some requirements.
          </p>

          <button
            type="button"
            onClick={tryAgain}
            className="mt-6 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Try another search
          </button>
        </div>
      )}
    </section>
  );
};

export default Results;