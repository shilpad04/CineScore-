import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Favorites from "./pages/Favorites.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Reviewed from "./pages/Reviewed.jsx";
import TrendingExplore from "./pages/TrendingExplore.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/reviewed" element={<Reviewed />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/trending" element={<TrendingExplore />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
