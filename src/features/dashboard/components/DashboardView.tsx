"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import type { Booking, BookingStatus } from "@/types/booking";
import { formatPrice, formatDate } from "@/lib/format";

interface Props {
  bookings: Booking[];
  savedCount: number;
  totalSpaces: number;
}

function trend(current: number, previous: number): { label: string; positive: boolean } | null {
  if (previous === 0) return null;
  const pct = ((current - previous) / previous) * 100;
  if (Math.abs(pct) < 1) return null;
  return { label: `${pct > 0 ? "+" : ""}${pct.toFixed(0)}% from last month`, positive: pct > 0 };
}

function getMonthTotals(bookings: Booking[], field: "count" | "amount") {
  const now = new Date();
  const thisMonth = { y: now.getFullYear(), m: now.getMonth() };
  const lastMonth = now.getMonth() === 0
    ? { y: now.getFullYear() - 1, m: 11 }
    : { y: now.getFullYear(), m: now.getMonth() - 1 };

  let current = 0, previous = 0;
  for (const b of bookings) {
    if (b.status === "Cancelled") continue;
    const d = new Date(b.date);
    const bm = { y: d.getFullYear(), m: d.getMonth() };
    if (bm.y === thisMonth.y && bm.m === thisMonth.m)
      current += field === "count" ? 1 : b.amount;
    if (bm.y === lastMonth.y && bm.m === lastMonth.m)
      previous += field === "count" ? 1 : b.amount;
  }
  return { current, previous };
}

function StatCard({
  label,
  value,
  sub,
  trendData,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trendData?: { label: string; positive: boolean } | null;
}) {
  return (
    <div className="bg-zinc-900 rounded-xl px-6 py-5 ring-1 ring-zinc-800">
      <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-semibold text-zinc-100 mt-2">{value}</p>
      {trendData ? (
        <p className={`text-xs mt-1.5 ${trendData.positive ? "text-emerald-400" : "text-red-400"}`}>
          {trendData.label}
        </p>
      ) : sub ? (
        <p className="text-xs mt-1.5 text-zinc-600">{sub}</p>
      ) : null}
    </div>
  );
}

function buildMonthlyData(bookings: Booking[]) {
  const map: Record<string, number> = {};
  for (const b of bookings) {
    if (b.status === "Cancelled") continue;
    const month = new Date(b.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    map[month] = (map[month] ?? 0) + b.amount;
  }
  return Object.entries(map)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => new Date(`01 ${a.month}`) > new Date(`01 ${b.month}`) ? 1 : -1);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any — recharts tooltip payload is untyped
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-zinc-400 mb-1">{label}</p>
      <p className="text-zinc-100 font-medium">{formatPrice(payload[0].value)}</p>
    </div>
  );
}

const statusStyles: Record<BookingStatus, string> = {
  Confirmed: "bg-emerald-500/15 text-emerald-400",
  Pending:   "bg-amber-500/15 text-amber-400",
  Cancelled: "bg-zinc-700 text-zinc-500",
};

export function DashboardView({ bookings, savedCount, totalSpaces }: Props) {
  const today = new Date().toISOString().split("T")[0]!;

  const activeBookings = bookings.filter(b => b.status === "Pending" || b.status === "Confirmed");
  const totalSpent = bookings
    .filter(b => b.status !== "Cancelled")
    .reduce((sum, b) => sum + b.amount, 0);

  const spendTrend = trend(...Object.values(getMonthTotals(bookings, "amount")) as [number, number]);
  const bookingTrend = trend(...Object.values(getMonthTotals(bookings, "count")) as [number, number]);

  const upcoming = bookings
    .filter(b => b.status !== "Cancelled" && b.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const monthlyData = buildMonthlyData(bookings);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Spaces Available"
          value={totalSpaces.toLocaleString()}
          sub="across all cities"
        />
        <StatCard
          label="Saved Spaces"
          value={savedCount}
          sub="in your collection"
        />
        <StatCard
          label="Active Bookings"
          value={activeBookings.length}
          trendData={bookingTrend}
        />
        <StatCard
          label="Total Spent"
          value={formatPrice(totalSpent)}
          trendData={spendTrend}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 rounded-xl ring-1 ring-zinc-800 px-6 py-5">
          <p className="text-sm font-medium text-zinc-100">Spending over time</p>
          <p className="text-xs text-zinc-500 mt-0.5 mb-4">Total: {formatPrice(totalSpent)}</p>
          {monthlyData.length === 0 ? (
            <p className="text-zinc-600 text-sm py-10 text-center">No spending data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#27272a" />
                <XAxis dataKey="month" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#27272a" }} />
                <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-zinc-900 rounded-xl ring-1 ring-zinc-800 px-6 py-5">
          <p className="text-sm font-medium text-zinc-100 mb-4">Upcoming bookings</p>
          {upcoming.length === 0 ? (
            <p className="text-zinc-600 text-sm">No upcoming bookings.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map(b => (
                <li key={b.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-zinc-100 text-sm truncate">{b.spaceName}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{formatDate(b.date)} · {b.type}</p>
                  </div>
                  <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[b.status]}`}>
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
