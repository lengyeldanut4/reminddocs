"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login reușit!");
    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          Login to RemindDocs
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-800 p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-800 p-3 mb-6"
        />

        <button
          onClick={handleLogin}
          className="w-full rounded-md bg-blue-600 py-3 font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="text-center text-slate-400 mt-6">
          Nu ai cont?{" "}
          <Link
            href="/register"
            className="text-blue-400 hover:text-blue-300"
          >
            Creează unul
          </Link>
        </p>
      </div>
    </main>
  );
}