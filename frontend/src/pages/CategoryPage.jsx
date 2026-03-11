import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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

function Sidebar({ categories, active }) {
  return (
    <aside className="w-full lg:w-[340px] flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
        <ul className="space-y-2 text-sm">
          {categories.map((c) => {
            const isActive = c === active;
            return (
              <li key={c}>
                <Link
                  to={c === "All" ? "/" : `/category/${encodeURIComponent(c)}`}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 ${
                    isActive ? "text-blue-700 font-semibold" : "text-gray-700"
                  }`}
                >
                  <span className="text-gray-400">›</span>
                  {c}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

export default function CategoryPage() {
  const { name } = useParams();
  const categoryName = useMemo(() => decodeURIComponent(name || ""), [name]);
  const [categories, setCategories] = useState(["All"]);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const list = data?.data;
        if (Array.isArray(list) && list.length) {
          const names = list.map((c) => (c && c.name ? c.name : c));
          setCategories(["All", ...names]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setArticles([]);
    setPage(1);
  }, [categoryName]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:5000/api/articles?page=1&limit=9&category=${encodeURIComponent(
            categoryName
          )}`
        );
        const data = await res.json();
        if (!cancelled) {
          setArticles(data?.data || []);
          setTotalPages(Number(data?.totalPages || 1));
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load articles.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (categoryName) load();
    return () => {
      cancelled = true;
    };
  }, [categoryName]);

  const loadMore = async () => {
    const next = page + 1;
    setLoadingMore(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5000/api/articles?page=${next}&limit=9&category=${encodeURIComponent(
          categoryName
        )}`
      );
      const data = await res.json();
      setArticles((prev) => [...prev, ...(data?.data || [])]);
      setPage(next);
      setTotalPages(Number(data?.totalPages || totalPages));
    } catch (e) {
      setError(e?.message || "Failed to load more.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#eff0f2" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <main className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {categoryName}
                </h2>
                <p className="text-sm text-gray-500">
                  Latest posts in this category
                </p>
              </div>
              <Link to="/" className="text-sm text-blue-600 hover:text-blue-800">
                ← Back to Home
              </Link>
            </div>

            {error ? (
              <div className="bg-white border border-red-200 text-red-700 rounded-xl p-4 mb-4">
                {error}
              </div>
            ) : null}

            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : articles.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <p className="text-gray-600">No articles found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {articles.map((item) => (
                    <ArticleCard key={item._id} item={item} />
                  ))}
                </div>
                {page < totalPages ? (
                  <div className="mt-6">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      {loadingMore ? "Loading..." : "Load more"}
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </main>

          <Sidebar categories={categories} active={categoryName} />
        </div>
      </div>
    </div>
  );
}

