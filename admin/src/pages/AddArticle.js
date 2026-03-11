import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../utils/categories";

export default function AddArticle() {
  const navigate = useNavigate(); 
  const [form, setForm] = useState({
    title: "",
    authorName: "",
    content: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); 

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("authorName", form.authorName);
    formData.append("content", form.content);
    formData.append("category", form.category);
    if (image) formData.append("image", image);

    await fetch("http://localhost:5000/api/articles", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // now protected route
      },
      body: formData,
    });

    navigate("/manage-articles");
  };

  return (
    <div className="card p-4 shadow">
      <h3 className="mb-3">Add New Article</h3>

      <form onSubmit={handleSubmit}>

        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        {/* Author */}
        <div className="mb-3">
          <label className="form-label">Author Name</label>
          <input
            type="text"
            className="form-control"
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
          />
        </div>

        {/* Image */}
        <div className="mb-3">
          <label className="form-label">Upload Article Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="mb-3">
            <img
              src={preview}
              alt="preview"
              style={{ width: "200px", borderRadius: "8px", border: "1px solid #ddd" }}
            />
          </div>
        )}

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Category</label>

          <select
            className="border p-2 rounded w-full form-control"
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id ?? cat} value={cat.name ?? cat}>
                {cat.name ?? cat}
              </option>
            ))}
          </select>
        </div>
        {/* Content */}
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows="5"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          ></textarea>
        </div>

        {/* Submit */}
        <button className="btn btn-success w-100">Save Article</button>
      </form>
    </div>
  );
}
