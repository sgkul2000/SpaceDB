import type { Metadata } from "next";
import { getData } from "@/lib/data";
import { SavedGrid } from "@/features/saved/components/SavedGrid";

export const metadata: Metadata = { title: "Saved" };

export default function SavedPage() {
  const spaces = getData.spaces();

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-5 border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Saved Spaces</h1>
      </div>
      <SavedGrid allSpaces={spaces} />
    </div>
  );
}
