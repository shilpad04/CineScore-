import { useEffect, useState } from "react";
import { fetchBySeed } from "../api/omdb.js";
import MovieCard from "./MovieCard.jsx";
import useLocalRatings from "../hooks/useLocalRatings.js";
import { Link } from "react-router-dom";

const SEEDS = [
  "the", "love", "star", "man", "girl",
  "war", "night", "dark", "king", "world"
];

function TrendingRow({ title = "Trending Now" }) {
  const [items, setItems] = useState([]);
  const { getRating } = useLocalRatings();

  useEffect(() => {
    const randomSeeds = [...SEEDS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    Promise.all(randomSeeds.map((term) => fetchBySeed(term)))
      .then((all) => {
        const merged = all
          .flatMap((res) => res.Search || [])
          .filter(
            (movie, idx, arr) =>
              arr.findIndex((m) => m.imdbID === movie.imdbID) === idx
          )
          .slice(0, 8);
        setItems(merged);
      })
      .catch(() => {
        setItems([]);
      });
  }, []);

  if (!items.length) {
    return (
      <section className="max-w-7xl mx-auto px-4 mt-10">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="text-neutral-400 text-sm mt-2">
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 mt-10">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            item={movie}
            avg={getRating(movie.imdbID)}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link
          to="/trending"
          className="bg-[#121212] border border-neutral-700 hover:border-[#f5c518] text-white rounded px-4 py-2 inline-flex items-center gap-2"
        >
          <i className="fa-solid fa-fire-flame-curved text-[#f5c518]"></i>
          <span>Explore More</span>
        </Link>
      </div>
    </section>
  );
}
export default TrendingRow;
