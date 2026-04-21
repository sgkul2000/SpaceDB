import type { Metadata } from "next";
import { getData } from "@/lib/data";
import { DashboardView } from "@/features/dashboard/components/DashboardView";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const bookings = getData.bookings();
  const saved = getData.saved();
  const spaces = getData.spaces();

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-5 border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Dashboard</h1>
      </div>
      <DashboardView bookings={bookings} savedCount={saved.length} totalSpaces={spaces.length} />
    </div>
  );
}
