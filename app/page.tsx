import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white overflow-hidden relative">

      {/* GLOW BACKGROUND */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[180px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-purple-500/10 blur-[160px] rounded-full" />

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-white/5 backdrop-blur-md relative z-10">
        <h1 className="text-lg font-semibold tracking-tight">
          📄 RemindDocs
        </h1>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Login
            </Button>
          </Link>

          <Link href="/register">
            <Button className="rounded-full px-6 bg-white text-black hover:bg-white/90">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32">

        {/* badge */}
        <div className="mb-6 px-4 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-slate-300">
          Smart document tracking powered by AI
        </div>

        {/* title */}
        <h1 className="text-6xl md:text-7xl font-semibold tracking-tight max-w-4xl leading-tight">
          Nu mai uita niciodată
          <span className="text-blue-400"> documentele tale</span>
        </h1>

        {/* subtitle */}
        <p className="text-slate-400 text-lg max-w-2xl mt-6">
          RemindDocs îți organizează documentele, îți urmărește expirarea și te notifică automat înainte să devină o problemă.
        </p>

        {/* CTA */}
        <div className="flex gap-4 mt-10">
          <Link href="/register">
            <Button size="lg" className="rounded-full px-8 bg-blue-500 hover:bg-blue-600">
              Începe gratuit
            </Button>
          </Link>

          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/15 text-white hover:bg-white/10"
            >
              Login
            </Button>
          </Link>
        </div>

        {/* floating cards preview */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">

          <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-sm text-slate-400">Document</p>
            <p className="font-semibold">Pașaport</p>
            <p className="text-green-400 text-sm mt-2">Valid</p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-sm text-slate-400">Document</p>
            <p className="font-semibold">Permis</p>
            <p className="text-yellow-400 text-sm mt-2">Expiră curând</p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-sm text-slate-400">Document</p>
            <p className="font-semibold">CI</p>
            <p className="text-red-400 text-sm mt-2">Expirat</p>
          </div>

        </div>

      </section>
    </main>
  );
}