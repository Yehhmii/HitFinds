import Link from "next/link";
import Image from "next/image";
import { getPosterUrl } from "@/lib/api";
import type { Movie } from "@/types";
import styles from "./MovieCard.module.css";

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  const year = movie.release_date?.split("-")[0] ?? "N/A";
  const rating = movie.vote_average.toFixed(1);
  const ratingColor =
    movie.vote_average >= 7
      ? "var(--green)"
      : movie.vote_average >= 5
      ? "var(--accent)"
      : "var(--red)";

  return (
    <Link href={`/movies/${movie.id}`} className={styles.card}>
      <div className={styles.poster}>
        <Image
          src={getPosterUrl(movie.poster_path, "w500")}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={styles.image}
          priority={priority}
          onError={() => {}}
        />
        <div className={styles.overlay} />
        <span className={styles.rating} style={{ color: ratingColor }}>
          ★ {rating}
        </span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <div className={styles.meta}>
          <span className={styles.year}>{year}</span>
          <span className={styles.votes}>{movie.vote_count.toLocaleString()} votes</span>
        </div>
      </div>
    </Link>
  );
}
