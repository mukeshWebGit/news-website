import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api/axios";

function makeExcerpt(text = "", limit = 140) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (t.length <= limit) return t;
  return t.slice(0, limit).trim() + "…";
}

function ArticleCard({ item }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      {item.image ? (
        <img
          src={`${API_BASE_URL}${item.image}`}
          alt=""
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="w-full h-44 bg-gray-100" />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
          {item.title}
        </h3>
        <div className="mt-2 text-xs text-gray-500">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
          {makeExcerpt(item.content)}
        </p>
        <Link
          to={`/news/${item._id}`}
          className="inline-flex items-center mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState(["All"]);
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sectionOrder = useMemo(() => categories.filter((c) => c !== "All"), [categories]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const catsRes = await fetch("http://localhost:5000/api/categories");
        const catsJson = await catsRes.json();
        const list = catsJson?.data;
        const names = Array.isArray(list) && list.length ? list.map((c) => (c && c.name ? c.name : c)) : [];
        const cats = ["All", ...names];
        if (!cancelled) setCategories(cats);

        const topCategories = names; // show all categories on home
        const results = await Promise.all(
          topCategories.map(async (cat) => {
            const res = await fetch(
              `http://localhost:5000/api/articles?page=1&limit=3&category=${encodeURIComponent(cat)}`
            );
            const json = await res.json();
            return [cat, json?.data || []];
          })
        );

        if (!cancelled) {
          const map = {};
          for (const [cat, items] of results) map[cat] = items;
          setSections(map);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load homepage.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#eff0f2" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <main>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Blog</h2>
            <p className="text-sm text-gray-500">Latest posts by category</p>
          </div>

          {error ? (
            <div className="bg-white border border-red-200 text-red-700 rounded-xl p-4 mb-4">
              {error}
            </div>
          ) : null}

          <div className="space-y-10">
            {sectionOrder
              .filter((c) => c in sections)
              .map((cat) => (
                <section key={cat}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{cat}</h3>
                    <Link
                      to={`/category/${encodeURIComponent(cat)}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View All →
                    </Link>
                  </div>

                  {sections[cat]?.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {sections[cat].map((item) => (
                        <ArticleCard key={item._id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <p className="text-sm text-gray-600">No posts yet.</p>
                    </div>
                  )}
                </section>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}
