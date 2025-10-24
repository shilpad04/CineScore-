import { Link } from "react-router-dom";
import useFavorites from "../hooks/useFavorites.js";
import RatingBadge from "./RatingBadge.jsx";

function MovieCard({ item, avg }) {
  const poster =
    item.Poster && item.Poster !== "N/A"
      ? item.Poster
      : "https://via.placeholder.com/300x445?text=No+Poster";

  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(item.imdbID);

  return (
    <div className="relative group bg-[#1f1f1f] rounded-lg overflow-hidden border border-neutral-800 hover:border-[#f5c518] transition">
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(item.imdbID);
        }}
        className="absolute right-2 top-2 z-10 text-[#f5c518] hover:scale-110 transition"
        title={fav ? "Remove from favorites" : "Add to favorites"}
      >
        <i className={`fa-${fav ? "solid" : "regular"} fa-heart text-xl`}></i>
      </button>

      <Link to={`/movie/${item.imdbID}`}>
        <div className="aspect-[2/3] overflow-hidden bg-[#121212]">
          <img
            src={poster}
            alt={item.Title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
            loading="lazy"
          />
        </div>
        <div className="p-3 space-y-1">
          <h3 className="font-semibold line-clamp-2">{item.Title}</h3>
          <p className="text-sm text-neutral-400">
            {item.Year} • {item.Type?.toUpperCase()}
          </p>
          <RatingBadge value={avg} />
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;
