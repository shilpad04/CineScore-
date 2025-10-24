import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { searchTitles } from "../api/omdb.js";

function Navbar() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);

  const navigate = useNavigate();
  const boxRef = useRef(null);

  useEffect(() => {
    setQuery(params.get("q") || "");
  }, [params]);

  useEffect(() => {
    function onDocClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShowSuggest(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setShowSuggest(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    let cancel = false;
    const t = setTimeout(async () => {
      try {
        const data = await searchTitles({
          query,
          page: 1,
        });

        if (cancel) return;

        if (data?.Response === "True") {
          setSuggestions(data.Search || []);
          setShowSuggest(true);
        } else {
          setSuggestions([]);
          setShowSuggest(false);
        }
      } catch {
        if (!cancel) {
          setSuggestions([]);
          setShowSuggest(false);
        }
      }
    }, 300);

    return () => {
      cancel = true;
      clearTimeout(t);
    };
  }, [query]);

  function submit(e) {
    e.preventDefault();

    const p = new URLSearchParams();
    if (query) p.set("q", query);
    p.set("page", "1");

    ["type", "y", "min", "genre", "filters"].forEach((key) => {
      const v = params.get(key);
      if (v) p.set(key, v);
    });

    setShowSuggest(false);

    navigate({
      pathname: "/search",
      search: `?${p.toString()}`,
    });
  }

  function chooseSuggestion(title) {
    const p = new URLSearchParams();
    if (title) p.set("q", title);
    p.set("page", "1");

    ["type", "y", "min", "genre", "filters"].forEach((key) => {
      const v = params.get(key);
      if (v) p.set(key, v);
    });

    setShowSuggest(false);

    navigate({
      pathname: "/search",
      search: `?${p.toString()}`,
    });
  }

  return (
    <header className="bg-[#1f1f1f] border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <Link
          to="/"
          className="text-[#f5c518] font-black text-xl leading-none whitespace-nowrap sm:text-2xl"
        >
          CineScore
        </Link>
        <form
          onSubmit={submit}
          ref={boxRef}
          className="relative flex-1 min-w-[200px] w-full order-last sm:order-none"
        >
          <input
            className="w-full bg-[#121212] text-white rounded pl-10 pr-4 py-2 outline-none border border-neutral-700 focus:border-[#f5c518] text-sm sm:text-base"
            placeholder="Search movies, series, episodes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length) setShowSuggest(true);
            }}
          />

          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm sm:text-base"></i>

          {showSuggest && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-[#1f1f1f] border border-neutral-700 rounded shadow-xl max-h-64 overflow-y-auto z-50">
              {suggestions.map((s) => {
                const poster =
                    s.Poster && s.Poster !== "N/A"
                      ? s.Poster
                      : "https://via.placeholder.com/60x90?text=No+Poster";

                return (
                  <button
                    key={s.imdbID}
                    type="button"
                    onMouseDown={() => chooseSuggestion(s.Title)}
                    className="w-full text-left px-3 py-2 hover:bg-[#121212] flex items-center gap-2"
                  >
                    <img
                      src={poster}
                      alt={s.Title}
                      className="w-8 h-12 object-cover rounded border border-neutral-700 bg-[#121212]"
                      loading="lazy"
                    />
                    <div className="text-xs sm:text-sm leading-tight">
                      <div className="text-white font-medium line-clamp-1">
                        {s.Title}
                      </div>
                      <div className="text-neutral-400 text-[10px] sm:text-xs">
                        {s.Year} • {s.Type?.toUpperCase()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </form>
        <nav className="flex flex-row flex-wrap gap-2">
          {/* Favorites */}
          <Link
            to="/favorites"
            className="inline-flex items-center gap-1 bg-[#121212] border border-neutral-700 hover:border-[#f5c518] rounded px-2 py-2 text-xs sm:text-sm sm:px-3"
            title="Favorites"
          >
            <i className="fa-solid fa-heart text-[#f5c518] text-sm sm:text-base"></i>
            <span className="text-white">Favorites</span>
          </Link>

          {/* Reviewed */}
          <Link
            to="/reviewed"
            className="inline-flex items-center gap-1 bg-[#121212] border border-neutral-700 hover:border-[#f5c518] rounded px-2 py-2 text-xs sm:text-sm sm:px-3"
            title="Reviewed by you"
          >
            <i className="fa-solid fa-star text-[#f5c518] text-sm sm:text-base"></i>
            <span className="text-white">Reviewed</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
