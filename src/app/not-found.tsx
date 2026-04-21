import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-semibold text-zinc-800">404</p>
        <p className="text-zinc-400 mt-3 text-sm">This page doesn't exist.</p>
        <Link
          href="/discovery"
          className="mt-5 inline-block text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Back to discovery
        </Link>
      </div>
    </div>
  );
}
