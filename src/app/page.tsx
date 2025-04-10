import { MapSearch } from "@/components/MapSearch";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Weather Location Search
        </h1>
        <MapSearch />
      </div>
    </main>
  );
}
