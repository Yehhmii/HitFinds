import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getMovieDetail,
  getMovieCredits,
  getBackdropUrl,
  getPosterUrl,
} from "@/lib/api";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CastSection } from "@/components/features/CastSection";
import { CastSkeleton } from "@/components/features/CastSection";
import styles from "./page.module.css";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieDetail(Number(id));
    return {
      title: movie.title,
      description: movie.overview?.slice(0, 155) || "Movie details on HitFinds",
      openGraph: {
        title: movie.title,
        description: movie.overview?.slice(0, 155),
        images: movie.backdrop_path
          ? [{ url: getBackdropUrl(movie.backdrop_path, "w780") }]
          : [],
      },
    };
  } catch {
    return { title: "Movie Not Found" };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (isNaN(movieId)) notFound();

  const movie = await getMovieDetail(movieId).catch(() => null);
  if (!movie) notFound();

  const year = movie.release_date?.split("-")[0] ?? "N/A";
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <article className={styles.page}>
      <div className={styles.backdropWrapper}>
        {movie.backdrop_path && (
          <Image
            src={getBackdropUrl(movie.backdrop_path, "w1280")}
            alt=""
            fill
            priority
            className={styles.backdrop}
            sizes="100vw"
          />
        )}
        <div className={styles.backdropGradient} />
      </div>

      <div className="container">
        <div className={styles.breadcrumbRow}>
          <Breadcrumb
            items={[
              { label: "Movies", href: "/" },
              { label: movie.title },
            ]}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.posterWrapper}>
            <Image
              src={getPosterUrl(movie.poster_path, "w500")}
              alt={`${movie.title} poster`}
              fill
              priority
              className={styles.poster}
              sizes="(max-width: 768px) 140px, 260px"
            />
          </div>

          <div className={styles.info}>
            <div className={styles.genreRow}>
              {movie.genres.map((g) => (
                <span key={g.id} className={styles.genre}>
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className={styles.title}>{movie.title}</h1>

            {movie.tagline && (
              <p className={styles.tagline}>&ldquo;{movie.tagline}&rdquo;</p>
            )}

            <div className={styles.metaRow}>
              <span className={styles.rating}>
                ★ {movie.vote_average.toFixed(1)}
                <span className={styles.votes}>
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              </span>
              <span className={styles.dot} aria-hidden="true">·</span>
              <span className={styles.year}>{year}</span>
              {runtime && (
                <>
                  <span className={styles.dot} aria-hidden="true">·</span>
                  <span className={styles.meta}>{runtime}</span>
                </>
              )}
              {movie.original_language && (
                <>
                  <span className={styles.dot} aria-hidden="true">·</span>
                  <span className={styles.meta}>
                    {movie.original_language.toUpperCase()}
                  </span>
                </>
              )}
            </div>

            {movie.overview && (
              <p className={styles.overview}>{movie.overview}</p>
            )}

            <div className={styles.statsRow}>
              {movie.budget > 0 && (
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Budget</span>
                  <span className={styles.statValue}>
                    ${(movie.budget / 1_000_000).toFixed(1)}M
                  </span>
                </div>
              )}
              {movie.revenue > 0 && (
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Revenue</span>
                  <span className={styles.statValue}>
                    ${(movie.revenue / 1_000_000).toFixed(1)}M
                  </span>
                </div>
              )}
              <div className={styles.stat}>
                <span className={styles.statLabel}>Status</span>
                <span className={styles.statValue}>{movie.status}</span>
              </div>
            </div>
          </div>
        </div>

        <section className={styles.castSection}>
          <h2 className={styles.sectionTitle}>Cast</h2>
          <Suspense fallback={<CastSkeleton />}>
            <CastSection movieId={movieId} />
          </Suspense>
        </section>
      </div>
    </article>
  );
}
