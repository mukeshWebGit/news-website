import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api/axios";
const categories = [
  "All", // empty => All
  "Politics",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "World",
  "Lifestyle",
];
function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [category, setCategory] = useState("All");  

  useEffect(() => {
    setLoading(true); 
     fetch(`http://localhost:5000/api/articles?page=1&limit=6${category !== "All" ? `&category=${category}` : ""}`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.data || []);
        setLoading(false); 
        console.log("Fetched articles:", data);
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
        setLoading(false);
      });
  }, [category]);

  if (loading) return <p className="p-4 text-gray-600">Loading...</p>;
  

 return (
    <div className="flex p-5 gap-6">

      {/* LEFT SIDE CATEGORY MENU */}
      <aside className="w-60 bg-gray-900 text-white rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">Categories</h2>

        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat}
              className={`cursor-pointer px-3 py-2 rounded-md 
                ${category === cat ? "bg-blue-600" : "hover:bg-gray-700"}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* RIGHT SIDE ARTICLE LIST */}
      <main className="flex-1">
        <h2 className="text-2xl font-bold mb-4">{category} Articles</h2>

        {articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((item) => (
              <div key={item._id} className="bg-white shadow-lg rounded-lg p-4">
                {item.image ? 
                <img
                  src={`${API_BASE_URL}${item.image}`}
                  alt=""
                  className="w-full h-40 object-cover rounded-md"
                />
                :null}
                <h3 className="font-bold mt-3">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="mt-2 text-gray-800 text-sm line-clamp-3">
                  {item.content}
                </p>
                <Link
              to={`/news/${item._id}`}
              className="inline-block mt-4 text-blue-600 font-medium hover:text-blue-800"
            >
              Read More →
            </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
