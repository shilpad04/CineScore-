import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchBySeed, getDetails } from "../api/omdb.js";
import MovieCard from "../components/MovieCard.jsx";
import Pagination from "../components/Pagination.jsx";
import FilterPane from "../components/FilterPane.jsx";
import useLocalRatings from "../hooks/useLocalRatings.js";

const SEEDS = [
  "the",
  "love",
  "star",
  "man",
  "girl",
  "war",
  "night",
  "dark",
  "king",
  "world",
];

const PAGE_SIZE = 12;

function TrendingExplore() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getRating } = useLocalRatings();
  const pageParam = Number(params.get("page") || "1");
  const page = Number.isNaN(pageParam) ? 1 : pageParam;
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
      pathname: "/trending",
      search: `?${p.toString()}`,
    });
  }, [params, navigate]);
  useEffect(() => {
    let cancel = false;

    async function run() {
      setLoading(true);
      try {
        const chosenSeeds = [...SEEDS].slice(0, 5);

        const batches = await Promise.all(
          chosenSeeds.map((term) => fetchBySeed(term).catch(() => null))
        );
        if (cancel) return;
        const rawList = batches
          .filter(Boolean)
          .flatMap((res) => res.Search || [])
          .filter(
            (movie, idx, arr) =>
              arr.findIndex((m) => m.imdbID === movie.imdbID) === idx
          );

        let prelim = rawList.filter((m) => {
          if (type && m.Type !== type) return false;
          if (year && m.Year !== year) return false;
          return true;
        });

        const detailed = await Promise.all(
          prelim.map((m) => getDetails(m.imdbID).catch(() => null))
        );
        if (cancel) return;

        let enriched = detailed.filter(Boolean).map((m) => ({
          Title: m.Title,
          Year: m.Year,
          imdbID: m.imdbID,
          Type: m.Type,
          Poster: m.Poster,
          Genre: m.Genre || "",
        }));

        // genre filter 
        if (genreFilter) {
          const gLower = genreFilter.toLowerCase();
          enriched = enriched.filter((m) =>
            m.Genre.toLowerCase().includes(gLower)
          );
        }

        // min-rating filter
        if (min > 0) {
          enriched = enriched.filter((m) => (getRating(m.imdbID) || 0) >= min);
        }

        enriched.sort((a, b) => a.Title.localeCompare(b.Title));

        setAllItems(enriched);
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    run();
    return () => {
      cancel = true;
    };
  }, [type, year, genreFilter, min, getRating]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
  }, [allItems.length]);
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return allItems.slice(start, start + PAGE_SIZE);
  }, [allItems, safePage]);

  return (
    <>
      <FilterPane basePath="/trending" />

      <section className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Trending Explore
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

        {!loading && pageItems.length === 0 && (
          <div className="text-neutral-400 text-sm">No results found.</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {pageItems.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              item={movie}
              avg={getRating(movie.imdbID)}
            />
          ))}
        </div>
        <Pagination total={totalPages} current={safePage} />
      </section>
    </>
  );
}

export default TrendingExplore;
