import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext.jsx";

function useFavorites() {
  return useContext(FavoritesContext);
}

export default useFavorites;
