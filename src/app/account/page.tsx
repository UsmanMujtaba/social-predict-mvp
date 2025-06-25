"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import AuthForm from "./AuthForm";
import type { User } from "@supabase/supabase-js";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="text-center text-neutral-500">Loading...</div>;

  if (!user) {
    return <AuthForm onAuth={() => window.location.reload()} />;
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-8">
      <h1 className="text-2xl font-bold mb-4 text-black">My Account</h1>
      <p className="text-neutral-700 mb-4">Welcome, <span className="font-semibold">{user.email}</span></p>
      {/* Subscription status and management UI will go here */}
      <button
        className="mt-6 bg-black text-white px-4 py-2 rounded font-semibold hover:bg-neutral-800 transition"
        onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
      >
        Log Out
      </button>
    </div>
  );
} 