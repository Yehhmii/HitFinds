"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { MovieCard } from "@/components/ui/MovieCard";
import { MovieGridSkeleton } from "@/components/ui/MovieCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "./Pagination";
import type { Movie, PaginatedResponse } from "@/types";
import styles from "./MovieGrid.module.css";

async function fetchMovies(
  query: string,
  genre: string,
  year: string,
  page: number
): Promise<PaginatedResponse<Movie>> {
  const params = new URLSearchParams({ page: String(page) });
  if (query) params.set("query", query);
  if (genre) params.set("genre", genre);
  if (year) params.set("year", year);

  const res = await fetch(`/api/movies?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export function MovieGrid() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const genre = searchParams.get("genre") ?? "";
  const year = searchParams.get("year") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["movies", query, genre, year, page],
    queryFn: () => fetchMovies(query, genre, year, page),
    staleTime: 60 * 1000,
  });

  if (isLoading) return <MovieGridSkeleton count={20} />;

  if (isError) {
    return (
      <EmptyState
        title="Something went wrong"
        description="We couldn't load movies. Please try again."
        action={{ label: "Retry", href: "/" }}
      />
    );
  }

  if (!data || data.results.length === 0) {
    return (
      <EmptyState
        title="No movies found"
        description={
          query
            ? `No results for "${query}". Try a different search.`
            : "No movies match your current filters."
        }
      />
    );
  }

  return (
    <>
      <div className={styles.grid} style={{ opacity: isFetching ? 0.6 : 1, transition: "opacity 0.2s" }}>
        {data.results.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} priority={i < 4} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={data.total_pages} />
    </>
  );
}