import type { Amenity, Category } from "./space";

export type SortOption = "price-asc" | "price-desc" | "rating" | "capacity" | "newest";

export interface Filters {
  search: string;
  categories: Category[];
  cities: string[];
  priceMin: number | null;
  priceMax: number | null;
  capacityMin: number | null;
  capacityMax: number | null;
  amenities: Amenity[];
  minRating: number | null;
  availabilityDate: string | null;
  sort: SortOption;
}
