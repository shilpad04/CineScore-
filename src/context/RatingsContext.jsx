import { createContext, useCallback, useEffect, useState } from "react";

export const RatingsContext = createContext(null);

export function RatingsProvider({ children }) {

  const [ratings, setRatings] = useState(() => {
    try {
      const raw = localStorage.getItem("movie_ratings_v1");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("movie_ratings_v1", JSON.stringify(ratings));
    } catch {}
  }, [ratings]);

  const setRating = useCallback((imdbID, value) => {
    setRatings((prev) => ({ ...prev, [imdbID]: value }));
  }, []);

  const getRating = useCallback(
    (imdbID) => ratings[imdbID] || 0,
    [ratings]
  );

  return (
    <RatingsContext.Provider
      value={{
        ratings,
        setRating,
        getRating,
      }}
    >
      {children}
    </RatingsContext.Provider>
  );
}
