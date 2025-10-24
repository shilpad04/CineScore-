import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GENRES = [
  "Action","Adventure","Animation","Biography","Comedy","Crime","Documentary","Drama",
  "Family","Fantasy","History","Horror","Music","Musical","Mystery","Romance",
  "Sci-Fi","Sport","Thriller","War","Western"
];

function FilterPane({ basePath = "/" }) {
  const [params] = useSearchParams();
  const [type, setType] = useState(params.get("type") || "");
  const [year, setYear] = useState(params.get("y") || "");
  const [minRating, setMinRating] = useState(params.get("min") || "");
  const [genre, setGenre] = useState(params.get("genre") || "");
  const navigate = useNavigate();

  useEffect(() => {
    setType(params.get("type") || "");
    setYear(params.get("y") || "");
    setMinRating(params.get("min") || "");
    setGenre(params.get("genre") || "");
  }, [params]);

  const years = useMemo(() => {
    const arr = [];
    const cur = new Date().getFullYear();
    for (let y = cur; y >= 1950; y--) arr.push(y);
    return arr;
  }, []);

  function apply() {
    const p = new URLSearchParams(params);
    type ? p.set("type", type) : p.delete("type");
    year ? p.set("y", year) : p.delete("y");
    minRating ? p.set("min", minRating) : p.delete("min");
    genre ? p.set("genre", genre) : p.delete("genre");
    p.set("page", "1");
    navigate({ pathname: basePath, search: `?${p.toString()}` });
  }

  function clear() {
    const p = new URLSearchParams(params);
    ["type", "y", "min", "genre"].forEach((k) => p.delete(k));
    p.set("page", "1");
    navigate({ pathname: basePath, search: `?${p.toString()}` });
  }

  const open = params.get("filters") === "1";
  if (!open) return null;

  return (
    <div className="bg-[#121212] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 py-4 grid gap-4 md:grid-cols-4">
        {/* Type */}
        <div>
          <label className="block text-sm text-neutral-300 mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-[#1f1f1f] border border-neutral-700 rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm text-neutral-300 mb-2">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full bg-[#1f1f1f] border border-neutral-700 rounded px-3 py-2"
          >
            <option value="">Any</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Min Rating */}
        <div>
          <label className="block text-sm text-neutral-300 mb-2">Min Rating</label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="w-full bg-[#1f1f1f] border border-neutral-700 rounded px-3 py-2"
          >
            <option value="">Any</option>
            <option value="1">★ 1+</option>
            <option value="2">★ 2+</option>
            <option value="3">★ 3+</option>
            <option value="4">★ 4+</option>
            <option value="5">★ 5</option>
          </select>
        </div>

        {/* Genre */}
        <div>
          <label className="block text-sm text-neutral-300 mb-2">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full bg-[#1f1f1f] border border-neutral-700 rounded px-3 py-2"
          >
            <option value="">Any</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-4 flex gap-3">
        <button
          onClick={apply}
          className="bg-[#f5c518] text-black font-semibold rounded px-4 py-2"
        >
          Apply Filters
        </button>
        <button
          onClick={clear}
          className="bg-[#1f1f1f] border border-neutral-700 rounded px-4 py-2 text-white"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default FilterPane;
