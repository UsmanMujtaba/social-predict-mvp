"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkSub() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();
        setSubscribed(!!sub);
      }
      setChecking(false);
    }
    checkSub();
  }, []);

  async function handleSubscribe() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to subscribe.");
      setLoading(false);
      router.push("/account");
      return;
    }
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Something went wrong.");
      setLoading(false);
    }
  }

  if (checking) return <div className="text-center text-neutral-500">Checking subscription...</div>;

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="max-w-xl w-full mx-auto bg-white rounded-2xl shadow-xl p-10 text-center border border-neutral-200">
        <h1 className="text-4xl font-extrabold mb-4 text-black tracking-tight">Premium Access</h1>
        <div className="flex justify-center mb-6">
          <span className="bg-black text-white px-4 py-2 rounded-full text-lg font-bold shadow inline-block">$4.99<span className="text-sm font-medium ml-1">/month</span></span>
        </div>
        <ul className="mb-8 text-left list-disc list-inside text-neutral-800 space-y-2 mx-auto max-w-xs">
          <li>Unlimited access to all premium articles</li>
          <li>Cancel anytime</li>
          <li>Support the platform</li>
        </ul>
        {subscribed ? (
          <div className="text-green-600 font-semibold">You are already subscribed!</div>
        ) : (
          <button
            className="w-full bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-neutral-800 transition disabled:opacity-60 shadow"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Subscribe with Stripe"}
          </button>
        )}
      </div>
    </div>
  );
} 