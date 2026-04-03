"use client";

import { useEffect } from "react";
import styles from "./error.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.icon} aria-hidden="true">⚠</div>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.description}>
        We hit an unexpected error. It&apos;s not you — it&apos;s us.
      </p>
      <div className={styles.actions}>
        <button onClick={reset} className={styles.primary}>
          Try again
        </button>
        <a href="/" className={styles.secondary}>
          Back to home
        </a>
      </div>
    </div>
  );
}
