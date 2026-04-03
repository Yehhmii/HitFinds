"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useSearch(debounceMs = 300) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(
    searchParams.get("query") ?? ""
  );

  useEffect(() => {
    const current = searchParams.get("query") ?? "";
    setInputValue(current);
  }, [searchParams]);

  const updateURL = useCallback(
    (value: string) => {
      const currentQuery = searchParams.get("query") ?? "";
      if (value === currentQuery) return;

      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("query", value);
      } else {
        params.delete("query");
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL(inputValue);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [inputValue, debounceMs, updateURL]);

  return { inputValue, setInputValue };
}
