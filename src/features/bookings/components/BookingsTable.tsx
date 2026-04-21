"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, X, Download } from "lucide-react";
import type { Booking, BookingStatus } from "@/types/booking";
import { api } from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/format";

type SortCol = "spaceName" | "date" | "type" | "amount" | "status";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS: BookingStatus[] = ["Pending", "Confirmed", "Cancelled"];

const statusStyles: Record<BookingStatus, string> = {
  Confirmed: "bg-emerald-500/15 text-emerald-400",
  Pending:   "bg-amber-500/15 text-amber-400",
  Cancelled: "bg-zinc-700 text-zinc-500",
};

function exportCSV(bookings: Booking[]) {
  const header = "Space Name,Date,Type,Status,Amount";
  const rows = bookings.map(b =>
    `"${b.spaceName}",${b.date},${b.type},${b.status},${b.amount}`
  );
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bookings.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function SortIcon({ col, sortCol, sortDir }: { col: SortCol; sortCol: SortCol | null; sortDir: SortDir }) {
  if (sortCol !== col) return <ChevronsUpDown size={13} className="text-zinc-600" />;
  return sortDir === "asc"
    ? <ChevronUp size={13} className="text-emerald-400" />
    : <ChevronDown size={13} className="text-emerald-400" />;
}

interface Props {
  initialBookings: Booking[];
}

export function BookingsTable({ initialBookings }: Props) {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortCol, setSortCol] = useState<SortCol | null>("date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = bookings;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => b.spaceName.toLowerCase().includes(q));
    }
    if (statusFilter.length) result = result.filter(b => statusFilter.includes(b.status));
    if (dateFrom) result = result.filter(b => b.date >= dateFrom);
    if (dateTo) result = result.filter(b => b.date <= dateTo);
    return result;
  }, [bookings, search, statusFilter, dateFrom, dateTo]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol];
      const cmp = typeof av === "number" ? av - (bv as number) : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortDir]);

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const toggleStatus = (s: BookingStatus) =>
    setStatusFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const allFilteredSelected = filtered.length > 0 && filtered.every(b => selected.has(b.id));
  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelected(prev => { const n = new Set(prev); filtered.forEach(b => n.delete(b.id)); return n; });
    } else {
      setSelected(prev => { const n = new Set(prev); filtered.forEach(b => n.add(b.id)); return n; });
    }
  };

  const cancelSelected = async () => {
    setCancelling(true);
    setError(null);
    const ids = [...selected].filter(id => {
      const b = bookings.find(x => x.id === id);
      return b && b.status !== "Cancelled";
    });
    try {
      await Promise.all(ids.map(id => api.bookings.update(id, { status: "Cancelled" })));
      setBookings(prev => prev.map(b => ids.includes(b.id) ? { ...b, status: "Cancelled" } : b));
      setSelected(new Set());
    } catch {
      setError("Some cancellations failed. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const cancelSingle = async (id: number) => {
    try {
      await api.bookings.update(id, { status: "Cancelled" });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Cancelled" } : b));
    } catch {
      setError("Cancellation failed. Please try again.");
    }
  };

  const ThCell = ({ col, label }: { col: SortCol; label: string }) => (
    <th
      className="px-4 py-3.5 text-left cursor-pointer select-none group"
      onClick={() => toggleSort(col)}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors">
        {label}
        <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />
      </div>
    </th>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* toolbar */}
      <div className="px-8 py-3 border-b border-zinc-800 space-y-2.5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by space name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm rounded-lg pl-8 pr-8 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <span className="text-zinc-600 text-xs">—</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div className="flex gap-1.5 ml-auto">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => toggleStatus(s)}
                className={`text-xs px-2.5 py-1.5 rounded-full transition-colors ${statusFilter.includes(s) ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">{selected.size} of {filtered.length} selected</span>
            <button
              onClick={cancelSelected}
              disabled={cancelling}
              className="text-xs bg-red-500/15 text-red-400 hover:bg-red-500/25 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {cancelling ? "Cancelling…" : "Cancel selected"}
            </button>
            <button
              onClick={() => exportCSV(sorted.filter(b => selected.has(b.id)))}
              className="text-xs flex items-center gap-1.5 bg-zinc-800 text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Download size={12} />
              Export CSV
            </button>
          </div>
        )}

        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      {sorted.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-zinc-500 text-sm">No bookings match your filters.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="rounded-xl overflow-hidden ring-1 ring-zinc-800">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded accent-emerald-500 bg-zinc-800 border-zinc-700 cursor-pointer"
                    />
                  </th>
                  <ThCell col="spaceName" label="Space" />
                  <ThCell col="date" label="Date" />
                  <ThCell col="type" label="Type" />
                  <ThCell col="amount" label="Amount" />
                  <ThCell col="status" label="Status" />
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-zinc-900/50">
                {sorted.map(b => (
                  <tr key={b.id} className={`hover:bg-zinc-800/40 transition-colors ${selected.has(b.id) ? "bg-zinc-800/30" : ""}`}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(b.id)}
                        onChange={() => setSelected(prev => { const n = new Set(prev); n.has(b.id) ? n.delete(b.id) : n.add(b.id); return n; })}
                        className="w-4 h-4 rounded accent-emerald-500 bg-zinc-800 border-zinc-700 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4 text-zinc-100 font-medium">{b.spaceName}</td>
                    <td className="px-4 py-4 text-zinc-400">{formatDate(b.date)}</td>
                    <td className="px-4 py-4 text-zinc-400">{b.type}</td>
                    <td className="px-4 py-4 text-zinc-100">{formatPrice(b.amount)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {b.status !== "Cancelled" && (
                        <button
                          onClick={() => cancelSingle(b.id)}
                          className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
