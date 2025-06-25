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
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
      <h1 className="text-2xl font-bold mb-4 text-black">Premium Articles</h1>
      {articles.length === 0 && <p className="text-neutral-700">No articles yet.</p>}
      <ul className="space-y-6">
        {articles.map(article => (
          <li key={article.id} className="border-b border-neutral-200 pb-4">
            <h2 className="text-lg font-semibold text-black mb-2">{article.title}</h2>
            {subscribed ? (
              <Link href={`/articles/${article.id}`} className="text-neutral-700 hover:underline">Read full article</Link>
            ) : (
              <>
                <p className="text-neutral-700 mb-2">{article.preview}</p>
                <Link href="/pricing" className="text-black underline">Subscribe to read more</Link>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 