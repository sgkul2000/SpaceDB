"use client";

import type { Space } from "@/types/space";
import { SpaceCard } from "./SpaceCard";

interface Props {
  spaces: Space[];
}

export function SpaceGrid({ spaces }: Props) {
  if (spaces.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 text-sm">No spaces match your filters.</p>
          <p className="text-zinc-600 text-xs mt-1">Try adjusting your search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {spaces.map(space => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
    </div>
  );
}
