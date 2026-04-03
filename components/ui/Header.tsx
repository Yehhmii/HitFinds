import Link from "next/link";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          HitFinds
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Movies
          </Link>
        </nav>
      </div>
    </header>
  );
}
