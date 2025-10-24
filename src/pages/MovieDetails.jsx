import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDetails } from "../api/omdb.js";
import StarRating from "../components/StarRating.jsx";
import RatingBadge from "../components/RatingBadge.jsx";
import useLocalRatings from "../hooks/useLocalRatings.js";
import useFavorites from "../hooks/useFavorites.js";

function MovieDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { getRating, setRating } = useLocalRatings();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    getDetails(id)
      .then((info) => setData(info))
      .catch(() => setData(null));
  }, [id]);

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link className="text-[#f5c518] hover:underline" to="/">
          ← Back
        </Link>
        <div className="mt-4 text-neutral-400">Loading…</div>
      </div>
    );
  }

  const poster =
    data.Poster && data.Poster !== "N/A"
      ? data.Poster
      : "https://via.placeholder.com/400x600?text=No+Poster";

  const userRating = getRating(data.imdbID);
  const fav = isFavorite(data.imdbID);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
        <Link className="text-[#f5c518] hover:underline" to="/">
          ← Back to results
        </Link>

            <button
          onClick={() => toggleFavorite(data.imdbID)}
          className="flex items-center gap-2 bg-[#1f1f1f] border border-neutral-700 rounded px-3 py-2 hover:border-[#f5c518]"
          title={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <i
            className={`fa-${fav ? "solid" : "regular"} fa-heart text-[#f5c518] text-lg`}
          ></i>
          <span className="text-sm hidden sm:inline text-white">
            {fav ? "Favorited" : "Favorite"}
          </span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <img
            src={poster}
            alt={data.Title}
            className="w-full rounded border border-neutral-800"
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-black">{data.Title}</h1>
            <p className="text-neutral-300 mt-1">
              {data.Year} • {data.Rated} • {data.Runtime}
            </p>
            <p className="text-neutral-300 mt-1">{data.Genre}</p>
          </div>

          <div>
            <RatingBadge value={userRating} />
          </div>

          <div>
            <h2 className="font-semibold mb-1">Your Rating</h2>
            <StarRating
              value={userRating}
              onChange={(v) => setRating(data.imdbID, v)}
            />
          </div>

          <div>
            <h2 className="font-semibold mb-2">Plot</h2>
            <p className="text-neutral-200">{data.Plot}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm text-neutral-300">
            <div>
              <div>
                <span className="text-neutral-400">Director:</span> {data.Director}
              </div>
              <div>
                <span className="text-neutral-400">Writer:</span> {data.Writer}
              </div>
              <div>
                <span className="text-neutral-400">Cast:</span> {data.Actors}
              </div>
            </div>
            <div>
              <div>
                <span className="text-neutral-400">Released:</span> {data.Released}
              </div>
              <div>
                <span className="text-neutral-400">Country:</span> {data.Country}
              </div>
              <div>
                <span className="text-neutral-400">Awards:</span> {data.Awards}
              </div>
            </div>
          </div>

          {data.Ratings?.length > 0 && (
            <div>
              <h2 className="font-semibold mb-2">External Ratings</h2>
              <ul className="space-y-1 text-neutral-300 text-sm">
                {data.Ratings.map((r, i) => (
                  <li key={i}>
                    {r.Source}: {r.Value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
