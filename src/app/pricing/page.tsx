"use client";
import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-black">Premium Access</h1>
      <p className="mb-6 text-neutral-700">Subscribe for just <span className="font-semibold text-black">$4.99/month</span> to unlock all premium articles.</p>
      <ul className="mb-6 text-left list-disc list-inside text-neutral-800">
        <li>Unlimited access to all premium articles</li>
        <li>Cancel anytime</li>
        <li>Support the platform</li>
      </ul>
      <button
        className="bg-black text-white px-6 py-3 rounded font-semibold hover:bg-neutral-800 transition disabled:opacity-60"
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? "Redirecting..." : "Subscribe with Stripe"}
      </button>
    </div>
  );
} 