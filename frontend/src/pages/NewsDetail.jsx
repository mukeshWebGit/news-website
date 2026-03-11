// pages/NewsDetail.jsx
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/axios";

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [latest, setLatest] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:5000/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => setArticle(data))
      .catch((err) => console.error(err));
  }, [id]);

   useEffect(() => {
    fetch("http://localhost:5000/api/articles?page=1&limit=8")
      .then((res) => res.json())
      .then((data) => { 
        const filtered = (data.data || []).filter((item) => String(item._id) !== String(id));
        setLatest(filtered.slice(0, 6));
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <>
    <div className="min-h-screen" style={{ backgroundColor: "#eff0f2" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <main className="flex-1">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>

            <nav className="text-sm text-gray-500 mb-4">
              <ol className="list-reset flex">
                <li>
                  <Link to="/" className="hover:text-blue-600">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="mx-2">/</span>
                </li>
                <li className="text-gray-700 font-medium truncate max-w-[260px]">
                  {article.title}
                </li>
              </ol>
            </nav>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {article.image ? (
                <img
                  src={`${API_BASE_URL}${article.image}`}
                  alt=""
                  className="w-full h-[360px] object-cover"
                />
              ) : null}

              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {article.title}
                </h1>
                <p className="text-sm text-gray-500 mb-4">
                  By {article.authorName} •{" "}
                  {article.createdAt
                    ? new Date(article.createdAt).toLocaleDateString()
                    : ""}
                </p>
                <div className="prose max-w-none">
                  <p className="text-gray-800 whitespace-pre-line">
                    {article.content}
                  </p>
                </div>
              </div>
            </div>
          </main>

          <aside className="w-full lg:w-[340px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Latest News</h4>
              {latest.length === 0 ? (
                <p className="text-sm text-gray-500">No posts yet.</p>
              ) : (
                <ul className="space-y-3">
                  {latest.map((p) => (
                    <li key={p._id} className="text-sm">
                      <Link
                        to={`/news/${p._id}`}
                        className="text-gray-800 hover:text-blue-700 font-medium line-clamp-2"
                      >
                        {p.title}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString()
                          : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
    </>
  );
}

export default NewsDetail;
