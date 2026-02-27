import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ManageArticles() {
  const [articles, setArticles] = useState([]);
 // ✅ Fetch articles when page loads
  const fetchArticles = async () => {
    fetch("http://localhost:5000/api/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data.data || [])); 
  };

  useEffect(() => {
    fetchArticles(); 
  }, []);
// Delete article
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/articles/${id}`); 
      alert("Article deleted successfully!");
      fetchArticles();
      
    } catch (err) {
      console.error("Error deleting article:", err); 
      alert("Failed to delete article.");
    }
  };
  return (
    <div>
      <h3 className="mb-3">Manage Articles</h3>
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a._id}>
              <td>{a.title}</td>
              <td>{a.authorName}</td>
              <td>{a.category}</td>
              <td>{new Date(a.createdAt).toLocaleString()}</td>
              <td>
                <Link
                  to={`/edit-article/${a._id}`}
                  className="btn btn-sm btn-primary me-2"
                > Edit
                </Link>
                 <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => handleDelete(a._id)} 
                  >
                    Delete
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
