"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    },
    [router, pathname, searchParams]
  );

  const pages = buildPageNumbers(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <nav className={styles.nav} aria-label="Pagination">
      <button
        className={styles.btn}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      <div className={styles.pages}>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={p}
              className={`${styles.page} ${p === currentPage ? styles.active : ""}`}
              onClick={() => goToPage(p as number)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className={styles.btn}
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}

function buildPageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  const capped = Math.min(total, 500);
  if (capped <= 7) return Array.from({ length: capped }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");

  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(capped - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }

  if (current < capped - 2) pages.push("...");
  pages.push(capped);
  return pages;
}
