import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getDetails, searchTitles } from "../api/omdb.js";
import MovieCard from "../components/MovieCard.jsx";
import Pagination from "../components/Pagination.jsx";
import FilterPane from "../components/FilterPane.jsx";
import useLocalRatings from "../hooks/useLocalRatings.js";

function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const { getRating } = useLocalRatings();

  const query = params.get("q") || "the";
  const page = Number(params.get("page") || "1");
  const type = params.get("type") || "";
  const year = params.get("y") || "";
  const min = Number(params.get("min") || "0");
  const genreFilter = params.get("genre") || "";
  const filtersOpen = params.get("filters") === "1";

  const toggleFilters = useCallback(() => {
    const p = new URLSearchParams(params);

    if (p.get("filters") === "1") {
      p.delete("filters");
    } else {
      p.set("filters", "1");
    }

    p.set("page", "1");

    navigate({
      pathname: "/search",
      search: `?${p.toString()}`,
    });
  }, [params, navigate]);

  useEffect(() => {
    let cancel = false;

    async function run() {
      setLoading(true);
      try {
          const data = await searchTitles({
          query,
          type: type || undefined,
          year: year || undefined,
          page,
        });

        if (cancel) return;

        if (data?.Response === "True") {
          setTotalPages(Math.ceil(Number(data.totalResults) / 10));
          const rawList = data.Search || [];

          const detailed = await Promise.all(
            rawList.map((m) => getDetails(m.imdbID).catch(() => null))
          );
          if (cancel) return;

          let enriched = detailed
            .filter(Boolean)
            .map((m) => ({
              Title: m.Title,
              Year: m.Year,
              imdbID: m.imdbID,
              Type: m.Type,
              Poster: m.Poster,
              Genre: m.Genre || "",
            }));

          if (genreFilter) {
            const gLower = genreFilter.toLowerCase();
            enriched = enriched.filter((m) =>
              m.Genre.toLowerCase().includes(gLower)
            );
          }

          if (min > 0) {
            enriched = enriched.filter(
              (m) => (getRating(m.imdbID) || 0) >= min
            );
          }

          setResults(enriched);
        } else {
          setResults([]);
          setTotalPages(0);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    run();
    return () => {
      cancel = true;
    };
  }, [query, page, type, year, genreFilter, min, getRating]);

  return (
    <>
      <FilterPane basePath="/search" />

      <section className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Search Results
          </h1>

          <button
            onClick={toggleFilters}
            className="inline-flex items-center gap-2 bg-[#121212] border border-neutral-700 hover:border-[#f5c518] rounded px-3 py-2 text-white text-xs sm:text-sm"
            title="Show filters"
          >
            <i className="fa-solid fa-filter text-[#f5c518] text-sm sm:text-base"></i>
            <span>{filtersOpen ? "Hide Filters" : "Show Filters"}</span>
          </button>
        </div>

        {loading && (
          <div className="text-sm text-neutral-400 mb-4">Loading…</div>
        )}

        {!loading && results.length === 0 && (
          <div className="text-neutral-400 text-sm">
            No results found.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              item={movie}
              avg={getRating(movie.imdbID)}
            />
          ))}
        </div>

        <Pagination total={totalPages} current={page} />
      </section>
    </>
  );
}

export default SearchResults;
