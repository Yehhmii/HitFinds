import styles from "./MovieCardSkeleton.module.css";

export function MovieCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={`${styles.poster} skeleton`} />
      <div className={styles.info}>
        <div className={`${styles.titleLine} skeleton`} />
        <div className={`${styles.titleLineShort} skeleton`} />
        <div className={styles.meta}>
          <div className={`${styles.metaChip} skeleton`} />
          <div className={`${styles.metaChipSm} skeleton`} />
        </div>
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
