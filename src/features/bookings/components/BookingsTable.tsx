"use client";

import { useState } from "react";
import type { Booking, BookingStatus } from "@/types/booking";
import { api } from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/format";

const statusStyles: Record<BookingStatus, string> = {
  Confirmed: "bg-emerald-500/15 text-emerald-400",
  Pending:   "bg-amber-500/15 text-amber-400",
  Cancelled: "bg-zinc-700 text-zinc-500",
};

interface Props {
  initialBookings: Booking[];
}

export function BookingsTable({ initialBookings }: Props) {
  const [bookings, setBookings] = useState(initialBookings);
  const [cancelling, setCancelling] = useState<number | null>(null);

  const cancel = async (id: number) => {
    setCancelling(id);
    try {
      await api.bookings.update(id, { status: "Cancelled" });
      setBookings(prev =>
        prev.map(b => (b.id === id ? { ...b, status: "Cancelled" } : b))
      );
    } catch {
      // TODO: show error toast
    } finally {
      setCancelling(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">No bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="rounded-xl overflow-hidden ring-1 ring-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900 border-b border-zinc-800 text-left">
              <th className="px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Space</th>
              <th className="px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Type</th>
              <th className="px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 bg-zinc-900/50">
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-zinc-800/40 transition-colors">
                <td className="px-5 py-4 text-zinc-100 font-medium">{b.spaceName}</td>
                <td className="px-5 py-4 text-zinc-400">{formatDate(b.date)}</td>
                <td className="px-5 py-4 text-zinc-400">{b.type}</td>
                <td className="px-5 py-4 text-zinc-100">{formatPrice(b.amount)}</td>
                <td className="px-5 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[b.status]}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {b.status !== "Cancelled" && (
                    <button
                      onClick={() => cancel(b.id)}
                      disabled={cancelling === b.id}
                      className="text-xs text-zinc-500 hover:text-red-400 disabled:opacity-40 transition-colors"
                    >
                      {cancelling === b.id ? "Cancelling…" : "Cancel"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
