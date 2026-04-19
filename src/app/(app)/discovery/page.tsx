import { api } from "@/lib/api";
import { SpaceGrid } from "@/features/discovery/components/SpaceGrid";

export default async function DiscoveryPage() {
  let spaces = await api.spaces.list().catch(() => null);

  if (spaces === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500 text-sm">
          Could not reach the API — is json-server running on port 3001?
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Discover Spaces</h1>
        <p className="text-zinc-500 text-sm mt-0.5">{spaces.length} spaces available</p>
      </div>
      <SpaceGrid spaces={spaces} />
    </div>
  );
}
