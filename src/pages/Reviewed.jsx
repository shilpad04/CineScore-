import { useEffect, useState } from "react";
import { getDetails } from "../api/omdb.js";
import useLocalRatings from "../hooks/useLocalRatings.js";
import MovieCard from "../components/MovieCard.jsx";

function Reviewed() {
  const { ratings, getRating } = useLocalRatings();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const ratedIds = Object.entries(ratings)
      .filter(([, score]) => score > 0)
      .map(([id]) => id);

    if (!ratedIds.length) {
      setMovies([]);
      return;
    }

    let cancel = false;

    Promise.all(
      ratedIds.map((id) => getDetails(id).catch(() => null))
    ).then((res) => {
      if (cancel) return;
      const valid = res.filter(Boolean);
      setMovies(valid);
    });

    return () => {
      cancel = true;
    };
  }, [ratings]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Your Reviews
      </h1>

      {movies.length === 0 ? (
        <div className="text-neutral-400 text-sm">
          You haven't rated anything yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              item={{
                Title: movie.Title,
                Year: movie.Year,
                imdbID: movie.imdbID,
                Type: movie.Type,
                Poster: movie.Poster,
              }}
              avg={getRating(movie.imdbID)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Reviewed;
