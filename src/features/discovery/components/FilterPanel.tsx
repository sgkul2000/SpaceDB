"use client";

import { X, SlidersHorizontal } from "lucide-react";
import type { Filters, SortOption } from "@/types/filters";
import type { Amenity, Category } from "@/types/space";
import { hasActiveFilters } from "@/features/discovery/lib/filters";

const CATEGORIES: Category[] = ["Banquet Hall", "Meeting Room", "Coworking", "Rooftop", "Studio"];
const AMENITIES: Amenity[] = ["Parking", "Catering", "AV Equipment", "WiFi", "Outdoor", "Bar"];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "rating",     label: "Top rated" },
  { value: "price-asc",  label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "capacity",   label: "Capacity" },
  { value: "newest",     label: "Newest" },
];

interface Props {
  filters: Filters;
  spaces: { city: string }[];
  onChange: (next: Partial<Filters>) => void;
  onReset: () => void;
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active
          ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40"
          : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
      }`}
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{children}</p>;
}

export function FilterPanel({ filters, spaces, onChange, onReset }: Props) {
  const cities = [...new Set(spaces.map(s => s.city))].sort();
  const active = hasActiveFilters(filters);

  const toggleArr = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  return (
    <aside className="w-56 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full overflow-y-auto">
      <div className="px-5 py-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
          <SlidersHorizontal size={15} />
          Filters
        </div>
        {active && (
          <button
            onClick={onReset}
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      <div className="px-5 py-4 space-y-6 flex-1">
        <div>
          <SectionLabel>Sort by</SectionLabel>
          <select
            value={filters.sort}
            onChange={e => onChange({ sort: e.target.value as SortOption })}
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <SectionLabel>Category</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <Chip
                key={c}
                label={c}
                active={filters.categories.includes(c)}
                onClick={() => onChange({ categories: toggleArr(filters.categories, c) })}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>City</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {cities.map(city => (
              <Chip
                key={city}
                label={city}
                active={filters.cities.includes(city)}
                onClick={() => onChange({ cities: toggleArr(filters.cities, city) })}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>Amenities</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map(a => (
              <Chip
                key={a}
                label={a}
                active={filters.amenities.includes(a)}
                onClick={() => onChange({ amenities: toggleArr(filters.amenities, a) })}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>Price / day</SectionLabel>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={filters.priceMin ?? ""}
              onChange={e => onChange({ priceMin: e.target.value ? Number(e.target.value) : null })}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-zinc-600 text-xs">—</span>
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={filters.priceMax ?? ""}
              onChange={e => onChange({ priceMax: e.target.value ? Number(e.target.value) : null })}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <SectionLabel>Min capacity</SectionLabel>
          <input
            type="number"
            min={0}
            placeholder="e.g. 50"
            value={filters.capacityMin ?? ""}
            onChange={e => onChange({ capacityMin: e.target.value ? Number(e.target.value) : null })}
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <SectionLabel>Min rating</SectionLabel>
          <div className="flex gap-2">
            {[3, 3.5, 4, 4.5].map(r => (
              <Chip
                key={r}
                label={`${r}+`}
                active={filters.minRating === r}
                onClick={() => onChange({ minRating: filters.minRating === r ? null : r })}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
