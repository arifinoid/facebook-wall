import { Wall } from "@/components/wall/wall";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="bg-fb-blue shadow-sm">
        <div className="mx-auto flex h-11 max-w-2xl items-center px-4">
          <span className="text-xl font-bold tracking-tight text-white">
            facebook
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <Wall />
      </main>
    </div>
  );
}
