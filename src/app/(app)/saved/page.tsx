import type { Metadata } from "next";
import { api } from "@/lib/api";

export const metadata: Metadata = { title: "Saved" };
import { SavedGrid } from "@/features/saved/components/SavedGrid";

export default async function SavedPage() {
  const spaces = await api.spaces.list().catch(() => null);

  if (spaces === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500 text-sm">Could not reach the API — is json-server running?</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-5 border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Saved Spaces</h1>
      </div>
      <SavedGrid allSpaces={spaces} />
    </div>
  );
}
