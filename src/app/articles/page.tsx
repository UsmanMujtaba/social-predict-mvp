"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  content: string;
  preview: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function fetchData() {
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
      // Fetch articles
      const { data } = await supabase.from("articles").select("id, title, content, preview, created_at").order("created_at", { ascending: false });
      setArticles(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-center text-neutral-500">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10">
      <h1 className="text-3xl font-extrabold mb-8 text-black text-center tracking-tight">Premium Articles</h1>
      {articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-neutral-700 text-lg mb-2">No articles have been published yet.</p>
          <a href="/pricing" className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-neutral-800 transition mt-2">Subscribe to get notified!</a>
        </div>
      )}
      <ul className="space-y-8">
        {articles.map(article => (
          <li key={article.id} className="border border-neutral-200 rounded-xl p-6 bg-neutral-50 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-black mb-2">{article.title}</h2>
            {subscribed ? (
              <Link href={`/articles/${article.id}`} className="text-blue-700 hover:underline font-semibold">Read full article &rarr;</Link>
            ) : (
              <>
                <p className="text-neutral-700 mb-2">{article.preview}</p>
                <Link href="/pricing" className="text-black underline font-semibold">Subscribe to read more</Link>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 