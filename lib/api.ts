import type { Credits, Genre, MovieDetail, PaginatedResponse, Movie } from "@/types";

const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

function getHeaders(): HeadersInit {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) throw new Error("TMDB_READ_ACCESS_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
  cacheOptions?: RequestInit["cache"] | { next: { revalidate: number } }
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const fetchOptions: RequestInit = {
    headers: getHeaders(),
    ...(typeof cacheOptions === "object" && "next" in cacheOptions
      ? cacheOptions
      : { cache: cacheOptions as RequestInit["cache"] }),
  };

  const res = await fetch(url.toString(), fetchOptions);
  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function getPopularMovies(page = 1): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch<PaginatedResponse<Movie>>(
    "/movie/popular",
    { page: String(page) },
    { next: { revalidate: 3600 } }
  );
}

export async function searchMovies(
  query: string,
  page = 1
): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch<PaginatedResponse<Movie>>(
    "/search/movie",
    { query, page: String(page), include_adult: "false" },
    "no-store"
  );
}

export async function discoverMovies(params: {
  page?: number;
  genre?: string;
  year?: string;
}): Promise<PaginatedResponse<Movie>> {
  const queryParams: Record<string, string> = {
    page: String(params.page ?? 1),
    sort_by: "popularity.desc",
  };
  if (params.genre) queryParams["with_genres"] = params.genre;
  if (params.year) queryParams["primary_release_year"] = params.year;

  return tmdbFetch<PaginatedResponse<Movie>>(
    "/discover/movie",
    queryParams,
    { next: { revalidate: 3600 } }
  );
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  return tmdbFetch<MovieDetail>(
    `/movie/${id}`,
    {},
    { next: { revalidate: 86400 } }
  );
}

export async function getMovieCredits(id: number): Promise<Credits> {
  return tmdbFetch<Credits>(
    `/movie/${id}/credits`,
    {},
    { next: { revalidate: 86400 } }
  );
}

export async function getGenres(): Promise<{ genres: Genre[] }> {
  return tmdbFetch<{ genres: Genre[] }>(
    "/genre/movie/list",
    {},
    { next: { revalidate: 86400 } }
  );
}

export function getPosterUrl(
  path: string | null,
  size: "w300" | "w500" | "w780" | "original" = "w500"
): string {
  if (!path) return "/fallback-poster.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: "w780" | "w1280" | "original" = "w1280"
): string {
  if (!path) return "/fallback-backdrop.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
}
