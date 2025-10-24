import { useEffect, useState } from "react";
import { getDetails } from "../api/omdb.js";
import MovieCard from "../components/MovieCard.jsx";
import useFavorites from "../hooks/useFavorites.js";
import useLocalRatings from "../hooks/useLocalRatings.js";

function Favorites() {
  const { getAllFavorites, favorites } = useFavorites();
  const { getRating } = useLocalRatings();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const ids = getAllFavorites();
    if (!ids.length) {
      setMovies([]);
      return;
    }

    let cancel = false;

    Promise.all(ids.map((id) => getDetails(id).catch(() => null))).then(
      (res) => {
        if (cancel) return;
        const valid = res.filter(Boolean);
        setMovies(valid);
      }
    );

    return () => {
      cancel = true;
    };
  }, [getAllFavorites, favorites]); 

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Your Favorites
      </h1>

      {movies.length === 0 ? (
        <div className="text-neutral-400 text-sm">
          You haven’t favorited any movies yet.
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

export default Favorites;
