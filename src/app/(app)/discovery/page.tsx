"use client";

import { useEffect, useState } from "react";

export default function DiscoveryPage() {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/spaces")
      .then(r => r.json())
      .then(data => setCount((data as unknown[]).length))
      .catch(() => setError(true));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-zinc-100">Space Discovery</h1>
      <p className="mt-2 text-zinc-400">
        {error
          ? "API unreachable — is json-server running on port 3001?"
          : count === null
          ? "Loading..."
          : `${count} spaces available`}
      </p>
    </main>
  );
}
