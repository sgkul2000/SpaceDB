import type { Metadata } from "next";
import { api } from "@/lib/api";

export const metadata: Metadata = { title: "Bookings" };
import { BookingsTable } from "@/features/bookings/components/BookingsTable";

export default async function BookingsPage() {
  const bookings = await api.bookings.list().catch(() => null);

  if (bookings === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500 text-sm">Could not reach the API — is json-server running?</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-5 border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Bookings</h1>
      </div>
      <BookingsTable initialBookings={bookings} />
    </div>
  );
}
