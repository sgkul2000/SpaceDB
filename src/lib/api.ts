import type { Space } from "@/types/space";
import type { Booking } from "@/types/booking";
import type { SavedSpace } from "@/types/saved";

const BASE = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
}

export const api = {
  spaces: {
    list: () => get<Space[]>("/spaces"),
  },
  bookings: {
    list: () => get<Booking[]>("/bookings"),
    update: (id: number, data: Partial<Booking>) => patch<Booking>(`/bookings/${id}`, data),
  },
  saved: {
    list: () => get<SavedSpace[]>("/saved"),
    add: (spaceId: number) => post<SavedSpace>("/saved", { spaceId }),
    remove: (id: number) => del(`/saved/${id}`),
  },
};
