import { MovieGridSkeleton } from "@/components/ui/MovieCardSkeleton";
import styles from "./page.module.css";

export default function Loading() {
  return (
    <div className={styles.page}>
      <div className="container">
        <section className={styles.hero}>
          <div
            className="skeleton"
            style={{ height: "3rem", width: "280px", marginBottom: "8px" }}
          />
          <div
            className="skeleton"
            style={{ height: "1rem", width: "220px" }}
          />
        </section>
        <div className={styles.controls} style={{ marginBottom: "28px" }}>
          <div
            className="skeleton"
            style={{ height: "42px", width: "320px", borderRadius: "6px" }}
          />
          <div
            className="skeleton"
            style={{ height: "42px", width: "140px", borderRadius: "6px" }}
          />
          <div
            className="skeleton"
            style={{ height: "42px", width: "120px", borderRadius: "6px" }}
          />
        </div>
        <MovieGridSkeleton count={20} />
      </div>
    </div>
  );
}
