"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../supabaseClient";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  content: string;
  preview: string;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { id } = params as { id: string };
      // Check subscription status
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
      // Fetch article
      const { data } = await supabase
        .from("articles")
        .select("id, title, content, preview")
        .eq("id", id)
        .single();
      setArticle(data || null);
      setLoading(false);
    }
    fetchData();
  }, [params]);

  if (loading) return <div className="text-center text-neutral-500">Loading...</div>;
  if (!article) return <div className="text-center text-neutral-500">Article not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10 mt-8">
      <h1 className="text-3xl font-extrabold mb-6 text-black text-center tracking-tight">{article.title}</h1>
      {subscribed ? (
        <p className="text-neutral-800 whitespace-pre-line text-lg leading-relaxed mb-8">{article.content}</p>
      ) : (
        <>
          <p className="text-neutral-700 mb-4 text-lg">{article.preview}</p>
          <div className="bg-neutral-100 p-4 rounded text-center mb-8">
            <Link href="/pricing" className="text-black underline font-semibold">Subscribe to read the full article</Link>
          </div>
        </>
      )}
      <div className="mt-8 flex justify-center">
        <button onClick={() => router.back()} className="text-neutral-600 hover:underline bg-neutral-200 px-4 py-2 rounded font-semibold">&larr; Back to articles</button>
      </div>
    </div>
  );
} 