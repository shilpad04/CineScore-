import axios from "axios";

const API_KEY = "e37eaa88";
const BASE_URL = "https://www.omdbapi.com/";

const api = axios.create({
  baseURL: BASE_URL,
  params: { apikey: API_KEY },
});


export async function searchTitles({ query, type, year, page = 1, genre }) {
  const effectiveQuery = [query, genre].filter(Boolean).join(" ");

  const res = await api.get("", {
    params: {
      s: effectiveQuery || "",
      type: type || undefined,
      y: year || undefined,
      page,
    },
  });
  return res.data;
}


export async function getDetails(imdbID) {
  const res = await api.get("", {
    params: { i: imdbID, plot: "full" },
  });
  return res.data;
}


export async function fetchBySeed(seed, page = 1) {
  const res = await api.get("", {
    params: { s: seed, page },
  });
  return res.data;
}
