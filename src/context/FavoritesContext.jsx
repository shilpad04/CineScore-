import { createContext, useCallback, useEffect, useState } from "react";

export const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {

  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("movie_favorites_v1");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "movie_favorites_v1",
        JSON.stringify(favorites)
      );
    } catch {}
  }, [favorites]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const updated = { ...prev };
      if (updated[id]) {
        delete updated[id];
      } else {
        updated[id] = true;
      }
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (id) => !!favorites[id],
    [favorites]
  );

  const getAllFavorites = useCallback(() => Object.keys(favorites), [favorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        getAllFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
