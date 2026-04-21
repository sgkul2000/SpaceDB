"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { LayoutGrid, Search, X } from "lucide-react";
import type { Space } from "@/types/space";
import type { Category } from "@/types/space";
import { useSavedStore } from "@/features/saved/store";
import { SpaceCard } from "@/features/discovery/components/SpaceCard";
import { useDebounce } from "@/hooks/useDebounce";

interface Props {
  allSpaces: Space[];
}

export function SavedGrid({ allSpaces }: Props) {
  const { savedIds, loaded, load } = useSavedStore();
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category[]>([]);
  const [cityFilter, setCityFilter] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => { load(); }, [load]);

  const saved = useMemo(() => allSpaces.filter(s => savedIds.has(s.id)), [allSpaces, savedIds]);

  const categories = useMemo(() => [...new Set(saved.map(s => s.category))].sort(), [saved]);
  const cities = useMemo(() => [...new Set(saved.map(s => s.city))].sort(), [saved]);

  const filtered = useMemo(() => {
    return saved.filter(s => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.city.toLowerCase().includes(q)) return false;
      }
      if (categoryFilter.length && !categoryFilter.includes(s.category)) return false;
      if (cityFilter.length && !cityFilter.includes(s.city)) return false;
      return true;
    });
  }, [saved, debouncedSearch, categoryFilter, cityFilter]);

  const toggleArr = <T,>(arr: T[], item: T) =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  if (!loaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-zinc-600 text-sm">Loading…</p>
      </div>
    );
  }

  if (saved.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 text-sm">No saved spaces yet.</p>
          <Link
            href="/discovery"
            className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <LayoutGrid size={13} />
            Browse spaces
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-8 py-3 border-b border-zinc-800 space-y-2.5">
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search saved spaces…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm rounded-lg pl-8 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchInput && (
              <button onClick={() => setSearchInput("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                <X size={13} />
              </button>
            )}
          </div>
          <p className="text-xs text-zinc-500">{filtered.length} of {saved.length} saved</p>
        </div>

        {(categories.length > 1 || cities.length > 1) && (
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategoryFilter(prev => toggleArr(prev, c))}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${categoryFilter.includes(c) ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"}`}
              >
                {c}
              </button>
            ))}
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setCityFilter(prev => toggleArr(prev, city))}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${cityFilter.includes(city) ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"}`}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-400 text-sm">No saved spaces match your filters.</p>
            <button onClick={() => { setSearchInput(""); setCategoryFilter([]); setCityFilter([]); }} className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(space => <SpaceCard key={space.id} space={space} />)}
          </div>
        </div>
      )}
    </div>
  );
}
