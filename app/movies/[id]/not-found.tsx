import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Movie Not Found</h1>
      <p className={styles.description}>
        This movie doesn&apos;t exist or may have been removed.
      </p>
      <Link href="/" className={styles.back}>
        ← Back to movies
      </Link>
    </div>
  );
}
