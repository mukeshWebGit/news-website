// pages/NewsDetail.jsx
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [suggestions, setSuggestions] = useState([]); 
  useEffect(() => {
    fetch(`http://localhost:5000/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => setArticle(data))
      .catch((err) => console.error(err));
  }, [id]);

   useEffect(() => {
    fetch("http://localhost:5000/api/articles")
      .then((res) => res.json())
      .then((data) => { 
        const filtered = (data.data || []).filter((item) => item.id !== id); 
        setSuggestions(filtered.slice(0, 4)); // show max 4 suggestions
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <>
    <div className="p-6">
       {/* 🔙 Back Button */}
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <nav className="text-sm text-gray-500 mb-4">
        <ol className="list-reset flex">
          <li>
            <Link to="/" className="hover:text-blue-600">Home</Link>
          </li>
          <li><span className="mx-2">/</span></li>
          <li className="text-gray-700 font-medium truncate max-w-[200px]">
            {article.title}
          </li>
        </ol>
      </nav>
        {article.image ? 
                <img
                  src={`http://localhost:5000${article.image}`}
                  alt=""
                  className="w-full h-100 object-cover rounded-md"
                />
                :null}
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-500 mb-2">
        By {article.authorName} • {new Date(article.createdAt).toLocaleDateString()}
      </p>
      <p>{article.content}</p>
    {/* Suggested news list */}
      {suggestions.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">You may also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((news) => (
              <Link
                key={news._id}
                to={`/news/${news._id}`}
                className="block p-4 border rounded hover:shadow transition"
              >
                <h3 className="font-bold text-lg mb-2">{news.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {news.content}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default NewsDetail;
