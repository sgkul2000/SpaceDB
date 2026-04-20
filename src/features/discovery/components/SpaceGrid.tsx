"use client";

import { useMemo, useRef, useState, useEffect, Suspense } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Search, X } from "lucide-react";
import type { Space } from "@/types/space";
import { useFiltersFromUrl } from "@/features/discovery/hooks/useFiltersFromUrl";
import { applyFilters, sortSpaces } from "@/features/discovery/lib/filters";
import { useDebounce } from "@/hooks/useDebounce";
import { FilterPanel } from "./FilterPanel";
import { SpaceCard } from "./SpaceCard";

const CARD_MIN_W = 260;
const ROW_H = 320;
const GAP = 20;

function Grid({ spaces }: { spaces: Space[] }) {
  const { filters, setFilters, resetFilters } = useFiltersFromUrl();
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // keep local input in sync if filters are reset externally
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const filtered = useMemo(() => {
    const f = applyFilters(spaces, filters);
    return sortSpaces(f, filters.sort);
  }, [spaces, filters]);

  // figure out column count from container width; default to 3 for SSR
  const cols = useMemo(() => {
    const w = containerRef.current?.clientWidth ?? 800;
    return Math.max(1, Math.floor((w + GAP) / (CARD_MIN_W + GAP)));
  }, [containerRef.current?.clientWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = Math.ceil(filtered.length / cols);

  const virtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ROW_H + GAP,
    overscan: 3,
  });

  return (
    <div className="flex flex-1 overflow-hidden">
      <FilterPanel
        filters={filters}
        spaces={spaces}
        onChange={setFilters}
        onReset={resetFilters}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* search bar */}
        <div className="px-6 py-3 border-b border-zinc-800">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search spaces or cities…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <p className="text-xs text-zinc-600 mt-1.5">{filtered.length} spaces</p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-zinc-400 text-sm">No spaces match your filters.</p>
              <button
                onClick={resetFilters}
                className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <div ref={containerRef} className="flex-1 overflow-y-auto px-6 py-5">
            <div
              style={{ height: virtualizer.getTotalSize(), position: "relative" }}
            >
              {virtualizer.getVirtualItems().map(vRow => {
                const startIdx = vRow.index * cols;
                const rowSpaces = filtered.slice(startIdx, startIdx + cols);
                return (
                  <div
                    key={vRow.key}
                    style={{
                      position: "absolute",
                      top: vRow.start,
                      left: 0,
                      right: 0,
                      height: ROW_H,
                      display: "grid",
                      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                      gap: GAP,
                    }}
                  >
                    {rowSpaces.map(space => (
                      <SpaceCard key={space.id} space={space} />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function SpaceGrid({ spaces }: { spaces: Space[] }) {
  return (
    <Suspense fallback={null}>
      <Grid spaces={spaces} />
    </Suspense>
  );
}
