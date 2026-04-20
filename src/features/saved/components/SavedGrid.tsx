"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import type { Space } from "@/types/space";
import { useSavedStore } from "@/features/saved/store";
import { SpaceCard } from "@/features/discovery/components/SpaceCard";

interface Props {
  allSpaces: Space[];
}

export function SavedGrid({ allSpaces }: Props) {
  const { savedIds, loaded, load } = useSavedStore();

  useEffect(() => {
    load();
  }, [load]);

  if (!loaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-zinc-600 text-sm">Loading…</p>
      </div>
    );
  }

  const saved = allSpaces.filter(s => savedIds.has(s.id));

  if (saved.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 text-sm">No saved spaces yet.</p>
          <Link
            href="/discovery"
            className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <LayoutGrid size={13} />
            Browse spaces
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <p className="text-xs text-zinc-600 mb-5">{saved.length} saved</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {saved.map(space => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
    </div>
  );
}
