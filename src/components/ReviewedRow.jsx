import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useLocalRatings from "../hooks/useLocalRatings.js";
import { getDetails } from "../api/omdb.js";
import MovieCard from "./MovieCard.jsx";

function ReviewedRow() {
  const { ratings } = useLocalRatings();
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const ratedIds = Object.entries(ratings)
      .filter(([, score]) => score > 0)
      .map(([id]) => id);

    if (!ratedIds.length) {
      setItems([]);
      setHasMore(false);
      return;
    }

    let cancel = false;

    Promise.all(
      ratedIds.map((id) => getDetails(id).catch(() => null))
    ).then((list) => {
      if (cancel) return;
      const cleaned =
        (list.filter(Boolean) || []).map((m) => ({
          Title: m.Title,
          Year: m.Year,
          imdbID: m.imdbID,
          Type: m.Type,
          Poster: m.Poster,
        })) || [];

      setHasMore(cleaned.length > 6);
      setItems(cleaned.slice(0, 6));
    });

    return () => {
      cancel = true;
    };
  }, [ratings]);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-10">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Reviewed by You</h2>

        {hasMore && (
          <Link
            to="/reviewed"
            className="text-sm text-[#f5c518] hover:underline"
          >
            See all →
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-neutral-400 text-sm italic">
          Review the movies, tell us what you think ?
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              item={movie}
              avg={ratings[movie.imdbID]}
            />
          ))}
        </div>
      )}
    </section>
  );
}
export default ReviewedRow;
