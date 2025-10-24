import { useMemo } from "react";
import TrendingRow from "../components/TrendingRow.jsx";
import ReviewedRow from "../components/ReviewedRow.jsx";

function Home() {
  const hero = useMemo(
    () => (
      <section className="bg-gradient-to-b from-[#0a0a0a] to-[#121212] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white">
              Rate. Discover. <span className="text-[#f5c518]">Review.</span>
            </h1>
            <p className="text-neutral-300 mt-3">
              Search titles, filter smartly, rate with stars, browse your
              favorites.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <i className="fa-solid fa-film text-[#f5c518] text-7xl"></i>
          </div>
        </div>
      </section>
    ),
    []
  );

  return (
    <>
      {hero}
      <TrendingRow title="Trending on CineScore" />
      <ReviewedRow />
    </>
  );
}
export default Home;
