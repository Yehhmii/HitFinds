import { Suspense } from "react";
import { getGenres } from "@/lib/api";
import { SearchInput } from "@/components/features/SearchInput";
import { FilterBar } from "@/components/features/FilterBar";
import { MovieGrid } from "@/components/features/MovieGrid";
import { MovieGridSkeleton } from "@/components/ui/MovieCardSkeleton";
import styles from "./page.module.css";

export const revalidate = 3600;

export default async function HomePage() {
  const genresData = await getGenres();

  return (
    <div className={styles.page}>
      <div className="container">
        <section className={styles.hero}>
          <h1 className={styles.heading}>Popular Movies</h1>
          <p className={styles.sub}>
            Discover what the world is watching right now
          </p>
        </section>

        <div className={styles.controls}>
          <Suspense>
            <SearchInput />
          </Suspense>
          <Suspense>
            <FilterBar genres={genresData.genres} />
          </Suspense>
        </div>

        <Suspense fallback={<MovieGridSkeleton count={20} />}>
          <MovieGrid />
        </Suspense>
      </div>
    </div>
  );
}