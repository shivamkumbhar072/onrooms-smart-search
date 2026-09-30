const Results = ({ results, tryAgain }) => {
  return (
    <section
      id="recommendations"
      className="mx-auto max-w-6xl px-6 py-20"
    >
      {results.length > 0 ? (
        <>
          {/* Header */}
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                ✦ AI Results
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Recommended PGs
              </h2>
            </div>

            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600">
              {results.length} {results.length === 1 ? "match" : "matches"}
            </span>
          </div>

          {/* Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((pg, index) => {
              const name = pg.name || pg.title || `PG ${index + 1}`;
              const location =
                pg.location || pg.area || pg.address || "Location not specified";
              const rent =
                pg.rent || pg.price || pg.monthly_rent || null;
              const gender = pg.gender || pg.type || null;
              const sharing = pg.sharing || pg.room_type || null;
              const amenities = Array.isArray(pg.amenities)
                ? pg.amenities
                : [];

              return (
                <article
                  key={pg.id || index}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-md"
                >
                  {/* Top: number + gender tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {gender && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {gender}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-gray-900">
                    {name}
                  </h3>

                  {/* Location */}
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="truncate">{location}</span>
                  </p>

                  {/* Meta row */}
                  {(sharing || rent) && (
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-sm text-gray-500">
                        {sharing || "Room"}
                      </span>

                      {rent && (
                        <span className="text-base font-semibold text-gray-900">
                          ₹{Number(rent).toLocaleString("en-IN")}
                          <span className="text-xs font-normal text-gray-500">
                            /mo
                          </span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Amenities — pushed to bottom */}
                  {amenities.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                      {amenities.slice(0, 4).map((a, i) => (
                        <span
                          key={i}
                          className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {a}
                        </span>
                      ))}
                      {amenities.length > 4 && (
                        <span className="rounded-md px-2 py-0.5 text-xs text-gray-500">
                          +{amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <div className="mx-auto max-w-xl py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-3xl">
            🔎
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            No PGs found
          </h2>

          <p className="mt-4 text-base text-gray-600">
            We couldn't find any PGs matching your requirements.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Try increasing your budget, changing the location, or removing some
            requirements.
          </p>

          <button
            type="button"
            onClick={tryAgain}
            className="mt-8 cursor-pointer rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Try another search
          </button>
        </div>
      )}
    </section>
  );
};

export default Results;