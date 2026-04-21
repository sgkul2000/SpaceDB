import type { Metadata } from "next";
import { getData } from "@/lib/data";
import { SpaceGrid } from "@/features/discovery/components/SpaceGrid";

export const metadata: Metadata = { title: "Discover" };

export default function DiscoveryPage() {
  const spaces = getData.spaces();

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-5 border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Discover Spaces</h1>
      </div>
      <SpaceGrid spaces={spaces} />
    </div>
  );
}
