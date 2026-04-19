"use client";

import { create } from "zustand";
import { api } from "@/lib/api";

interface SavedStore {
  savedIds: Set<number>;
  // maps spaceId -> saved record id (needed for DELETE)
  recordMap: Map<number, number>;
  loaded: boolean;
  load: () => Promise<void>;
  toggle: (spaceId: number) => Promise<void>;
}

export const useSavedStore = create<SavedStore>((set, get) => ({
  savedIds: new Set(),
  recordMap: new Map(),
  loaded: false,

  load: async () => {
    if (get().loaded) return;
    try {
      const records = await api.saved.list();
      const ids = new Set(records.map(r => r.spaceId));
      const map = new Map(records.map(r => [r.spaceId, r.id]));
      set({ savedIds: ids, recordMap: map, loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  toggle: async (spaceId) => {
    const { savedIds, recordMap } = get();
    const isSaved = savedIds.has(spaceId);

    // optimistic update
    const nextIds = new Set(savedIds);
    const nextMap = new Map(recordMap);
    if (isSaved) {
      nextIds.delete(spaceId);
      nextMap.delete(spaceId);
    } else {
      nextIds.add(spaceId);
    }
    set({ savedIds: nextIds, recordMap: nextMap });

    try {
      if (isSaved) {
        const recordId = recordMap.get(spaceId);
        if (recordId !== undefined) await api.saved.remove(recordId);
      } else {
        const record = await api.saved.add(spaceId);
        nextMap.set(spaceId, record.id);
        set({ recordMap: new Map(nextMap) });
      }
    } catch {
      // rollback
      set({ savedIds: new Set(savedIds), recordMap: new Map(recordMap) });
    }
  },
}));
