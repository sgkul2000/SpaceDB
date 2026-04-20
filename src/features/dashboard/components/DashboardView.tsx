"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Booking } from "@/types/booking";
import { formatPrice } from "@/lib/format";

interface Props {
  bookings: Booking[];
  savedCount: number;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-zinc-900 rounded-xl px-6 py-5 ring-1 ring-zinc-800">
      <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-semibold text-zinc-100 mt-2">{value}</p>
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
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-zinc-400 mb-1">{label}</p>
      <p className="text-zinc-100 font-medium">{formatPrice(payload[0].value)}</p>
    </div>
  );
}

export function DashboardView({ bookings, savedCount }: Props) {
  const confirmed = bookings.filter(b => b.status === "Confirmed").length;
  const pending = bookings.filter(b => b.status === "Pending").length;
  const totalSpent = bookings
    .filter(b => b.status !== "Cancelled")
    .reduce((sum, b) => sum + b.amount, 0);

  const monthlyData = buildMonthlyData(bookings);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={bookings.length} />
        <StatCard label="Confirmed" value={confirmed} />
        <StatCard label="Pending" value={pending} />
        <StatCard label="Saved Spaces" value={savedCount} />
      </div>

      <div className="bg-zinc-900 rounded-xl ring-1 ring-zinc-800 px-6 py-5">
        <div className="mb-1">
          <p className="text-sm font-medium text-zinc-100">Spending over time</p>
          <p className="text-xs text-zinc-500 mt-0.5">Total: {formatPrice(totalSpent)}</p>
        </div>

        {monthlyData.length === 0 ? (
          <p className="text-zinc-600 text-sm py-10 text-center">No spending data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ top: 16, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#27272a" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#27272a" }} />
              <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
