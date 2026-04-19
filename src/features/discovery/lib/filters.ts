import type { Space } from "@/types/space";
import type { Filters, SortOption } from "@/types/filters";
import type { Amenity, Category } from "@/types/space";

export const defaultFilters: Filters = {
  search: "",
  categories: [],
  cities: [],
  priceMin: null,
  priceMax: null,
  capacityMin: null,
  capacityMax: null,
  amenities: [],
  minRating: null,
  availabilityDate: null,
  sort: "rating",
};

export function applyFilters(spaces: Space[], filters: Filters): Space[] {
  return spaces.filter(s => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.city.toLowerCase().includes(q)) return false;
    }
    if (filters.categories.length && !filters.categories.includes(s.category)) return false;
    if (filters.cities.length && !filters.cities.includes(s.city)) return false;
    if (filters.amenities.length && !filters.amenities.every(a => s.amenities.includes(a))) return false;
    if (filters.priceMin !== null && s.price < filters.priceMin) return false;
    if (filters.priceMax !== null && s.price > filters.priceMax) return false;
    if (filters.capacityMin !== null && s.capacity < filters.capacityMin) return false;
    if (filters.capacityMax !== null && s.capacity > filters.capacityMax) return false;
    if (filters.minRating !== null && s.rating < filters.minRating) return false;
    return true;
  });
}

export function sortSpaces(spaces: Space[], sort: SortOption): Space[] {
  const arr = [...spaces];
  switch (sort) {
    case "price-asc":  return arr.sort((a, b) => a.price - b.price);
    case "price-desc": return arr.sort((a, b) => b.price - a.price);
    case "rating":     return arr.sort((a, b) => b.rating - a.rating);
    case "capacity":   return arr.sort((a, b) => b.capacity - a.capacity);
    case "newest":     return arr.sort((a, b) => b.id - a.id);
    default:           return arr;
  }
}

export function serializeFilters(filters: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.search)              p.set("q", filters.search);
  if (filters.categories.length)   p.set("categories", filters.categories.join(","));
  if (filters.cities.length)       p.set("cities", filters.cities.join(","));
  if (filters.amenities.length)    p.set("amenities", filters.amenities.join(","));
  if (filters.priceMin !== null)   p.set("priceMin", String(filters.priceMin));
  if (filters.priceMax !== null)   p.set("priceMax", String(filters.priceMax));
  if (filters.capacityMin !== null) p.set("capMin", String(filters.capacityMin));
  if (filters.capacityMax !== null) p.set("capMax", String(filters.capacityMax));
  if (filters.minRating !== null)  p.set("rating", String(filters.minRating));
  if (filters.sort !== defaultFilters.sort) p.set("sort", filters.sort);
  return p;
}

export function parseFilters(params: URLSearchParams): Filters {
  return {
    search:           params.get("q") ?? "",
    categories:       params.get("categories")?.split(",").filter(Boolean) as Category[] ?? [],
    cities:           params.get("cities")?.split(",").filter(Boolean) ?? [],
    amenities:        params.get("amenities")?.split(",").filter(Boolean) as Amenity[] ?? [],
    priceMin:         params.get("priceMin") ? Number(params.get("priceMin")) : null,
    priceMax:         params.get("priceMax") ? Number(params.get("priceMax")) : null,
    capacityMin:      params.get("capMin") ? Number(params.get("capMin")) : null,
    capacityMax:      params.get("capMax") ? Number(params.get("capMax")) : null,
    minRating:        params.get("rating") ? Number(params.get("rating")) : null,
    availabilityDate: null,
    sort:             (params.get("sort") as SortOption) ?? defaultFilters.sort,
  };
}

export function hasActiveFilters(filters: Filters): boolean {
  const d = defaultFilters;
  return (
    filters.search !== d.search ||
    filters.categories.length > 0 ||
    filters.cities.length > 0 ||
    filters.amenities.length > 0 ||
    filters.priceMin !== null ||
    filters.priceMax !== null ||
    filters.capacityMin !== null ||
    filters.capacityMax !== null ||
    filters.minRating !== null
  );
}
