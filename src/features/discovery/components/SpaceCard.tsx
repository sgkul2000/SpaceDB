"use client";

import { useEffect } from "react";
import { Heart, MapPin, Users, Star } from "lucide-react";
import type { Space } from "@/types/space";
import { useSavedStore } from "@/features/saved/store";
import { formatPrice } from "@/lib/format";

interface Props {
  space: Space;
}

export function SpaceCard({ space }: Props) {
  const { savedIds, loaded, load, toggle } = useSavedStore();
  const isSaved = savedIds.has(space.id);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden ring-1 ring-zinc-800 hover:ring-zinc-600 transition-all group">
      <div className="relative h-44 overflow-hidden">
        <img
          src={space.imageUrl}
          alt={space.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => toggle(space.id)}
          disabled={!loaded}
          aria-label={isSaved ? "Remove from saved" : "Save space"}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-zinc-950/70 flex items-center justify-center hover:bg-zinc-950 transition-colors disabled:opacity-50"
        >
          <Heart
            size={15}
            className={isSaved ? "fill-emerald-400 text-emerald-400" : "text-zinc-300"}
          />
        </button>
        <span className="absolute bottom-3 left-3 bg-zinc-950/70 text-zinc-200 text-xs px-2 py-1 rounded-md">
          {space.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-zinc-100 font-medium text-sm leading-snug truncate">{space.name}</h3>

        <div className="flex items-center gap-1 mt-1.5 text-zinc-500 text-xs">
          <MapPin size={11} />
          <span>{space.city}</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-zinc-400 text-xs">
            <Users size={11} />
            <span>Up to {space.capacity}</span>
          </div>
          <div className="flex items-center gap-0.5 text-zinc-400 text-xs">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span>{space.rating.toFixed(1)}</span>
            <span className="text-zinc-600 ml-0.5">({space.reviewCount})</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-100 text-sm font-semibold">{formatPrice(space.price)}</span>
          <span className="text-zinc-500 text-xs">/day</span>
        </div>
      </div>
    </div>
  );
}
