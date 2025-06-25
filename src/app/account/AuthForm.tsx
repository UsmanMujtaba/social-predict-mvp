"use client";
import { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function AuthForm({ onAuth }: { onAuth?: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let result;
    if (mode === "login") {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else {
      onAuth?.();
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-black text-center">
        {mode === "login" ? "Log In" : "Sign Up"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-neutral-200 rounded focus:outline-none focus:border-black bg-neutral-50 text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-neutral-200 rounded focus:outline-none focus:border-black bg-neutral-50 text-black"
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-neutral-800 transition"
        >
          {loading ? (mode === "login" ? "Logging in..." : "Signing up...") : (mode === "login" ? "Log In" : "Sign Up")}
        </button>
      </form>
      <div className="mt-4 text-center text-neutral-600 text-sm">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{' '}
            <button className="underline" onClick={() => setMode("signup")}>Sign Up</button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button className="underline" onClick={() => setMode("login")}>Log In</button>
          </>
        )}
      </div>
    </div>
  );
} 