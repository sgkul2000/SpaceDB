import { describe, it, expect } from "vitest";
import {
  applyFilters,
  sortSpaces,
  serializeFilters,
  parseFilters,
  defaultFilters,
} from "./filters";
import type { Space, Category, Amenity } from "@/types/space";

const base: Space = {
  id: 1,
  name: "The Grand Hall",
  description: "",
  city: "New York",
  category: "Banquet Hall",
  price: 1500,
  capacity: 200,
  rating: 4.5,
  reviewCount: 42,
  amenities: ["WiFi", "Parking"],
  imageUrl: "",
  createdAt: "2024-01-01",
};

const spaces: Space[] = [
  base,
  { ...base, id: 2, name: "Rooftop View", city: "Austin", category: "Rooftop", price: 800, capacity: 50, rating: 3.8, amenities: ["Bar", "Outdoor"] },
  { ...base, id: 3, name: "Studio A",     city: "New York", category: "Studio",  price: 400, capacity: 10, rating: 4.9, amenities: ["WiFi"] },
  { ...base, id: 4, name: "The Loft",     city: "Chicago",  category: "Coworking", price: 200, capacity: 30, rating: 4.1, amenities: ["WiFi", "Catering"] },
];

// --- applyFilters ---

describe("applyFilters", () => {
  it("returns all spaces when filters are default", () => {
    expect(applyFilters(spaces, defaultFilters)).toHaveLength(4);
  });

  it("filters by search term on name", () => {
    const result = applyFilters(spaces, { ...defaultFilters, search: "grand" });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe(1);
  });

  it("filters by search term on city", () => {
    const result = applyFilters(spaces, { ...defaultFilters, search: "austin" });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe(2);
  });

  it("filters by category", () => {
    const result = applyFilters(spaces, { ...defaultFilters, categories: ["Studio"] });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe(3);
  });

  it("filters by multiple categories", () => {
    const result = applyFilters(spaces, { ...defaultFilters, categories: ["Studio", "Rooftop"] });
    expect(result).toHaveLength(2);
  });

  it("filters by city", () => {
    const result = applyFilters(spaces, { ...defaultFilters, cities: ["New York"] });
    expect(result).toHaveLength(2);
  });

  it("filters by amenity — requires all selected amenities", () => {
    const result = applyFilters(spaces, { ...defaultFilters, amenities: ["WiFi", "Parking"] });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe(1);
  });

  it("filters by priceMin", () => {
    const result = applyFilters(spaces, { ...defaultFilters, priceMin: 500 });
    expect(result.map(s => s.id)).toEqual(expect.arrayContaining([1, 2]));
    expect(result).toHaveLength(2);
  });

  it("filters by priceMax", () => {
    const result = applyFilters(spaces, { ...defaultFilters, priceMax: 400 });
    expect(result.map(s => s.id)).toEqual(expect.arrayContaining([3, 4]));
  });

  it("filters by capacityMin", () => {
    const result = applyFilters(spaces, { ...defaultFilters, capacityMin: 100 });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe(1);
  });

  it("filters by minRating", () => {
    const result = applyFilters(spaces, { ...defaultFilters, minRating: 4.5 });
    expect(result.map(s => s.id)).toEqual(expect.arrayContaining([1, 3]));
    expect(result).toHaveLength(2);
  });

  it("composes multiple filters", () => {
    const result = applyFilters(spaces, {
      ...defaultFilters,
      cities: ["New York"],
      priceMax: 500,
    });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe(3);
  });

  it("returns empty array when nothing matches", () => {
    const result = applyFilters(spaces, { ...defaultFilters, search: "zzznomatch" });
    expect(result).toHaveLength(0);
  });
});

// --- sortSpaces ---

describe("sortSpaces", () => {
  it("sorts by price ascending", () => {
    const result = sortSpaces(spaces, "price-asc");
    const prices = result.map(s => s.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("sorts by price descending", () => {
    const result = sortSpaces(spaces, "price-desc");
    const prices = result.map(s => s.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it("sorts by rating descending", () => {
    const result = sortSpaces(spaces, "rating");
    expect(result[0]!.id).toBe(3); // rating 4.9
    expect(result[result.length - 1]!.id).toBe(2); // rating 3.8
  });

  it("sorts by capacity descending", () => {
    const result = sortSpaces(spaces, "capacity");
    expect(result[0]!.id).toBe(1); // capacity 200
  });

  it("sorts by newest (id desc)", () => {
    const result = sortSpaces(spaces, "newest");
    expect(result[0]!.id).toBe(4);
    expect(result[result.length - 1]!.id).toBe(1);
  });

  it("does not mutate the input array", () => {
    const original = [...spaces];
    sortSpaces(spaces, "price-asc");
    expect(spaces.map(s => s.id)).toEqual(original.map(s => s.id));
  });
});

// --- serializeFilters / parseFilters ---

describe("serializeFilters + parseFilters round-trip", () => {
  it("round-trips default filters to empty params", () => {
    const params = serializeFilters(defaultFilters);
    expect(params.toString()).toBe("");
  });

  it("round-trips search", () => {
    const f = { ...defaultFilters, search: "loft" };
    const parsed = parseFilters(serializeFilters(f));
    expect(parsed.search).toBe("loft");
  });

  it("round-trips categories", () => {
    const f = { ...defaultFilters, categories: ["Studio", "Rooftop"] as Category[] };
    const parsed = parseFilters(serializeFilters(f));
    expect(parsed.categories).toEqual(["Studio", "Rooftop"]);
  });

  it("round-trips amenities", () => {
    const f = { ...defaultFilters, amenities: ["WiFi", "Parking"] as Amenity[] };
    const parsed = parseFilters(serializeFilters(f));
    expect(parsed.amenities).toEqual(["WiFi", "Parking"]);
  });

  it("round-trips price range", () => {
    const f = { ...defaultFilters, priceMin: 100, priceMax: 2000 };
    const parsed = parseFilters(serializeFilters(f));
    expect(parsed.priceMin).toBe(100);
    expect(parsed.priceMax).toBe(2000);
  });

  it("round-trips minRating", () => {
    const f = { ...defaultFilters, minRating: 4 };
    const parsed = parseFilters(serializeFilters(f));
    expect(parsed.minRating).toBe(4);
  });

  it("round-trips non-default sort", () => {
    const f = { ...defaultFilters, sort: "price-asc" as const };
    const parsed = parseFilters(serializeFilters(f));
    expect(parsed.sort).toBe("price-asc");
  });

  it("omits default sort from params", () => {
    const params = serializeFilters(defaultFilters);
    expect(params.has("sort")).toBe(false);
  });

  it("parses nulls for missing optional fields", () => {
    const parsed = parseFilters(new URLSearchParams());
    expect(parsed.priceMin).toBeNull();
    expect(parsed.priceMax).toBeNull();
    expect(parsed.minRating).toBeNull();
    expect(parsed.capacityMin).toBeNull();
  });
});
