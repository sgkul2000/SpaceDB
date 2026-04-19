"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Filters } from "@/types/filters";
import { parseFilters, serializeFilters, defaultFilters } from "@/features/discovery/lib/filters";

export function useFiltersFromUrl() {
  const params = useSearchParams();
  const router = useRouter();

  const filters = parseFilters(params);

  const setFilters = useCallback((next: Partial<Filters>) => {
    const updated = { ...parseFilters(params), ...next };
    const qs = serializeFilters(updated).toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  }, [params, router]);

  const resetFilters = useCallback(() => {
    router.replace("?", { scroll: false });
  }, [router]);

  return { filters, setFilters, resetFilters, defaultFilters };
}
