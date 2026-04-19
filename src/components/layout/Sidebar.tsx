"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Heart, BarChart2, CalendarDays, LogOut } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";

const links = [
  { href: "/discovery", label: "Discovery", icon: <LayoutGrid size={18} /> },
  { href: "/saved",     label: "Saved",     icon: <Heart size={18} /> },
  { href: "/dashboard", label: "Dashboard", icon: <BarChart2 size={18} /> },
  { href: "/bookings",  label: "Bookings",  icon: <CalendarDays size={18} /> },
];

function Initials({ first, last }: { first: string; last: string }) {
  const letters = (first[0] ?? "") + (last[0] ?? "");
  return (
    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-zinc-950 text-xs font-semibold uppercase flex-shrink-0">
      {letters}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-60 flex-shrink-0 bg-zinc-900 flex flex-col h-full">
      <div className="px-6 py-6">
        <span className="text-zinc-100 font-semibold text-lg tracking-tight">
          Space<span className="text-emerald-400">Base</span>
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {links.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-zinc-800 text-emerald-400"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
              }`}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <Initials first={user?.firstName ?? "?"} last={user?.lastName ?? ""} />
          <div className="min-w-0">
            <p className="text-sm text-zinc-100 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800/50 transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
