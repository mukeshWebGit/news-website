import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditArticle() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", authorName: "", content: "",category: "", image: null });
const [preview, setPreview] = useState(null);
  useEffect(() => {
    fetch(`http://localhost:5000/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {setForm(data)
      setPreview(data.image ? `http://localhost:5000${data.image}` : null); 
      console.log("Fetched article for edit:", data);
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
          <label className="form-label">authorName - {form.authorName}</label>
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
  <select
    value={form.category}
    onChange={(e) => setForm({ ...form, Category:e.target.value})}
    className="form-control"
    required
  >
    <option value="">{form.category}</option>
    <option value="Politics">Politics</option>
    <option value="Business">Business</option>
    <option value="Technology">Technology</option>
    <option value="Sports">Sports</option>
    <option value="Entertainment">Entertainment</option>
    <option value="World">World</option>
    <option value="Lifestyle">Lifestyle</option>
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
