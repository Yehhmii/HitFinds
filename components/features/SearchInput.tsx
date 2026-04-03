"use client";

import { useSearch } from "@/hooks/useSearch";
import styles from "./SearchInput.module.css";

export function SearchInput() {
  const { inputValue, setInputValue } = useSearch(300);

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden="true">
        ⌕
      </span>
      <input
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search movies..."
        className={styles.input}
        aria-label="Search movies"
      />
      {inputValue && (
        <button
          className={styles.clear}
          onClick={() => setInputValue("")}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
