import Image from "next/image";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full max-w-3xl mx-auto text-center py-16 px-4">
        <div className="mb-8 flex flex-col items-center">
          <img src="https://undraw.co/api/illustrations/modern-hero" alt="Hero" className="w-48 h-48 mb-6 mx-auto" />
          <h1 className="text-5xl font-extrabold text-black mb-4 tracking-tight leading-tight">Unlock Premium Insights</h1>
          <p className="text-xl text-neutral-700 mb-8 max-w-xl mx-auto">Get exclusive access to expert-written articles and stay ahead in your field. Join our community of curious minds and never miss out on the latest trends.</p>
          <a href="/pricing" className="inline-block bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-neutral-800 transition shadow">Subscribe Now</a>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="w-full max-w-4xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl mb-2">📚</span>
          <h3 className="font-bold text-lg mb-1">Expert Content</h3>
          <p className="text-neutral-600">Curated articles from industry leaders and professionals.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl mb-2">🔒</span>
          <h3 className="font-bold text-lg mb-1">Members Only</h3>
          <p className="text-neutral-600">Premium content accessible only to active subscribers.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl mb-2">💡</span>
          <h3 className="font-bold text-lg mb-1">Stay Ahead</h3>
          <p className="text-neutral-600">Get the latest insights and trends delivered to you first.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-3xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-extrabold text-black text-center mb-8">What Our Members Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6 text-left">
            <p className="text-neutral-700 mb-4">“The articles are always insightful and help me stay ahead in my industry. Worth every penny!”</p>
            <div className="font-bold text-black">— Alex T.</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-left">
            <p className="text-neutral-700 mb-4">“I love the exclusive content and the community. Highly recommended for anyone who wants to grow.”</p>
            <div className="font-bold text-black">— Jamie L.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
