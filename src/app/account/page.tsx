"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import AuthForm from "./AuthForm";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [subId, setSubId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMsg, setCancelMsg] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
      if (data.user) {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("status, stripe_subscription_id")
          .eq("user_id", data.user.id)
          .single();
        setSubStatus(sub?.status || null);
        setSubId(sub?.stripe_subscription_id || null);
      }
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleCancel() {
    if (!user) return;
    setCancelLoading(true);
    setCancelMsg(null);
    const res = await fetch("/api/stripe/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });
    const data = await res.json();
    if (data.status === "canceled" || data.status === "incomplete_expired" || data.status === "canceled_at_period_end") {
      setCancelMsg("Your subscription will be canceled at the end of the billing period.");
      setSubStatus(data.status);
    } else if (data.error) {
      setCancelMsg(data.error);
    }
    setCancelLoading(false);
  }

  if (loading) return <div className="text-center text-neutral-500">Loading...</div>;

  if (!user) {
    return <AuthForm onAuth={() => window.location.reload()} />;
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-10 mt-8">
      <h1 className="text-3xl font-extrabold mb-6 text-black text-center tracking-tight">My Account</h1>
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center text-2xl font-bold text-black mb-2">
          {user.email?.[0]?.toUpperCase()}
        </div>
        <p className="text-neutral-700 font-medium">{user.email}</p>
      </div>
      <div className="mb-8">
        <h2 className="font-semibold text-black mb-2 text-lg">Subscription Status</h2>
        {subStatus === "active" ? (
          <div className="text-green-600 font-semibold mb-2 flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span> Active
          </div>
        ) : (
          <div className="text-red-600 font-semibold mb-2 flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span> Not subscribed
          </div>
        )}
        {subId && (
          <div className="text-xs text-neutral-400 mb-2">Subscription ID: {subId}</div>
        )}
        {subStatus === "active" && (
          <button
            className="mt-2 bg-white border border-black text-black px-4 py-2 rounded font-semibold hover:bg-neutral-100 transition disabled:opacity-60"
            onClick={handleCancel}
            disabled={cancelLoading}
          >
            {cancelLoading ? "Canceling..." : "Cancel Subscription"}
          </button>
        )}
        {cancelMsg && <div className="mt-2 text-sm text-neutral-700 text-center">{cancelMsg}</div>}
        {subStatus !== "active" && (
          <Link href="/pricing" className="inline-block mt-4 bg-black text-white px-4 py-2 rounded font-semibold hover:bg-neutral-800 transition">Subscribe Now</Link>
        )}
      </div>
      <button
        className="w-full bg-black text-white px-4 py-2 rounded font-semibold hover:bg-neutral-800 transition"
        onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
      >
        Log Out
      </button>
    </div>
  );
} 