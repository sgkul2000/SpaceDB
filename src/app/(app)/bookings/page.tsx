import type { Metadata } from "next";
import { getData } from "@/lib/data";
import { BookingsTable } from "@/features/bookings/components/BookingsTable";

export const metadata: Metadata = { title: "Bookings" };

export default function BookingsPage() {
  const bookings = getData.bookings();

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-5 border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Bookings</h1>
      </div>
      <BookingsTable initialBookings={bookings} />
    </div>
  );
}
