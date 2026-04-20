import { api } from "@/lib/api";
import { DashboardView } from "@/features/dashboard/components/DashboardView";

export default async function DashboardPage() {
  const [bookings, saved] = await Promise.all([
    api.bookings.list().catch(() => null),
    api.saved.list().catch(() => []),
  ]);

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
        <h1 className="text-xl font-semibold text-zinc-100">Dashboard</h1>
      </div>
      <DashboardView bookings={bookings} savedCount={saved.length} />
    </div>
  );
}
