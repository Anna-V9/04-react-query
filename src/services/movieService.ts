import axios from "axios";
import type { MovieResponse } from "./movieService.types";


const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN as string;

if (!TOKEN) {
  console.warn("VITE_TMDB_TOKEN is not set. Add it to .env or Vercel variables");
}

export interface FetchMoviesParams {
  query: string;
  page?: number;
  include_adult?: boolean;
}


export const fetchMovies = async (
  params: FetchMoviesParams
): Promise<MovieResponse> => {
  const config = {
    params: {
      query: params.query,
      page: params.page ?? 1,
      include_adult: params.include_adult ?? false,
      language: "en-US",
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  };

  const response = await axios.get<MovieResponse>(
    `${BASE_URL}/search/movie`,
    config
  );

  return response.data; 
};
