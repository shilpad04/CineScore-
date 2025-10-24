import { useContext } from "react";
import { RatingsContext } from "../context/RatingsContext.jsx";

function useLocalRatings() {
  return useContext(RatingsContext);
}

export default useLocalRatings;
