"use client";

import { useFilter } from "@/hooks/useFilter";
import type { Genre } from "@/types";
import styles from "./FilterBar.module.css";

const YEARS = Array.from({ length: 30 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

interface FilterBarProps {
  genres: Genre[];
}

export function FilterBar({ genres }: FilterBarProps) {
  const { genre, year, setFilter, clearFilters } = useFilter();
  const hasFilters = genre || year;

  return (
    <div className={styles.bar}>
      <select
        value={genre}
        onChange={(e) => setFilter("genre", e.target.value)}
        className={styles.select}
        aria-label="Filter by genre"
      >
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g.id} value={String(g.id)}>
            {g.name}
          </option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => setFilter("year", e.target.value)}
        className={styles.select}
        aria-label="Filter by year"
      >
        <option value="">All Years</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button onClick={clearFilters} className={styles.clearBtn}>
          Clear filters
        </button>
      )}
    </div>
  );
}
