"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    if (!data.session) {
      setLoading(false);
      alert("Nu s-a creat sesiunea");
      return;
    }

    // 🔥 IMPORTANT: mic delay ca Supabase să salveze session
    setTimeout(() => {
      router.replace("/dashboard");
      router.refresh();
    }, 200);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          RemindDocs Login
        </h1>

        <input
          className="w-full p-3 mb-4 bg-slate-800 border border-slate-700 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 mb-6 bg-slate-800 border border-slate-700 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold"
        >
          {loading ? "Se conectează..." : "Login"}
        </button>

        <p className="text-center text-slate-400 mt-6">
          Nu ai cont? <Link href="/register" className="text-blue-400">Register</Link>
        </p>
      </div>
    </main>
  );
}