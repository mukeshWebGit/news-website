import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategories, addCategory as addCategoryApi } from "../utils/categories";

export default function EditArticle() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    authorName: "",
    content: "",
    category: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
        setPreview(data.image ? `http://localhost:5000${data.image}` : null);
        // ensure existing category is in list (e.g. from before categories were in DB)
        if (data.category) {
          setCategories((prev) => {
            const has = prev.some((c) => (c && c.name) === data.category || c === data.category);
            return has ? prev : [...prev, { _id: data.category, name: data.category }];
          });
        }
      });
  }, [id]);
 const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, newImage: file });
      setPreview(URL.createObjectURL(file));
    }  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

 const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("authorName", form.authorName);
    formData.append("category", form.category);

    // Only append new image if user selected one
    if (form.newImage) {
      formData.append("image", form.newImage);
    }

    await fetch(`http://localhost:5000/api/articles/${id}`, {
      method: "PUT", 
       body: formData,
    });
    navigate("/manage-articles");
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCategoryError("");
    const name = newCategory.trim();
    if (!name) return;

    if (categories.some((c) => (c && c.name) === name || c === name)) {
      setForm({ ...form, category: name });
      setNewCategory("");
      return;
    }

    try {
      const updated = await addCategoryApi(name);
      setCategories(updated);
      setForm({ ...form, category: name });
      setNewCategory("");
    } catch (err) {
      setCategoryError(err.message || "Failed to add category");
    }
  };

  return (
    <div className="card p-4 shadow">
      <h3 className="mb-3">Edit Article</h3>
      <form onSubmit={handleSubmit}>
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
        <div className="mb-3">
          <label className="form-label">Author Name</label>
          <input
            type="text"
            className="form-control"
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
          />
        </div>
        {/* Category */}
<div className="mb-3">
      <label className="form-label">Category</label>

      <div className="d-flex gap-2 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Add new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handleAddCategory}
        >
          Add
        </button>
      </div>
      {categoryError && <p className="text-danger small mb-1">{categoryError}</p>}

      <select
        value={form.category}
        onChange={(e) =>
          setForm({
            ...form,
            category: e.target.value,
          })
        }
        className="form-control"
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
        <div className="mb-3">
            <label className="form-label">Image</label>
            <input type="file" className="form-control" onChange={handleFileChange} />
          </div>

          {preview && (
            <div className="mb-3">
              <p>Preview:</p>
              <img src={preview} alt="Preview" width="200" className="rounded border" />
            </div>
          )}
        <button className="btn btn-primary">Update Article</button>
      </form>
    </div>
  );
}
