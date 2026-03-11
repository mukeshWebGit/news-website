import React, { useEffect, useState } from "react";
import { fetchCategories, addCategory, updateCategory, deleteCategory } from "../utils/categories";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const list = await fetchCategories();
    setCategories(Array.isArray(list) ? list : []);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const name = newName.trim();
    if (!name) {
      setError("Category name is required.");
      return;
    }
    const exists = categories.some((c) => (c && c.name) === name);
    if (exists) {
      setError("This category already exists.");
      return;
    }
    try {
      const updated = await addCategory(name);
      setCategories(Array.isArray(updated) ? updated : []);
      setNewName("");
      setSuccess(`"${name}" added successfully.`);
    } catch (err) {
      setError(err.message || "Failed to add category.");
    }
  };

  const startEdit = (cat) => {
    if (!cat) return;
    setEditing(cat._id);
    setEditName(cat.name || "");
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditName("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setError("");
    setSuccess("");
    const name = editName.trim();
    if (!name) {
      setError("Category name is required.");
      return;
    }
    const duplicate = categories.find((c) => c && c.name === name && c._id !== editing);
    if (duplicate) {
      setError("This category name already exists.");
      return;
    }
    try {
      const idToUse = editing != null ? String(editing) : "";
      const updated = await updateCategory(idToUse, name);
      setCategories(Array.isArray(updated) ? updated : []);
      setSuccess(`Category updated to "${name}".`);
      cancelEdit();
    } catch (err) {
      setError(err.message || "Failed to update category.");
    }
  };

  const handleDelete = async (cat) => {
    if (!cat) return;
    const id = cat._id != null ? String(cat._id) : null;
    if (!id || id.startsWith("fallback") || id.startsWith("default")) {
      setError("Cannot delete: refresh the page to load categories from the server first.");
      return;
    }
    if (!window.confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
    setError("");
    setSuccess("");
    try {
      const updated = await deleteCategory(id);
      setCategories(Array.isArray(updated) ? updated : []);
      setSuccess(`"${cat.name}" deleted.`);
    } catch (err) {
      setError(err.message || "Failed to delete category.");
    }
  };

  return (
    <div className="card p-4 shadow">
      <h3 className="mb-4">Manage Categories</h3>

      <div className="mb-4 p-3 bg-light rounded">
        <h5 className="mb-3">Add New Category</h5>
        <form onSubmit={handleAdd} className="d-flex gap-2 flex-wrap align-items-end">
          <div className="flex-grow-1" style={{ minWidth: "200px" }}>
            <label className="form-label small mb-1">Category name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Science, Health"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Category
          </button>
        </form>
        {error && <p className="text-danger small mt-2 mb-0">{error}</p>}
        {success && <p className="text-success small mt-2 mb-0">{success}</p>}
      </div>

      <h5 className="mb-3">Existing Categories</h5>
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-muted">No categories yet. Add one above.</p>
      ) : (
        <ul className="list-group">
          {categories.map((cat) => {
            const id = cat && (cat._id != null ? String(cat._id) : null);
            const name = cat && (cat.name ?? cat);
            const isEditing = editing === id || editing === cat._id;

            return (
              <li key={id || name} className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2">
                {isEditing ? (
                  <form onSubmit={handleSaveEdit} className="d-flex gap-2 align-items-center flex-grow-1 flex-wrap">
                    <input
                      type="text"
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      style={{ maxWidth: "240px" }}
                    />
                    <button type="submit" className="btn btn-sm btn-success">Save</button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="badge bg-secondary me-2">Category</span>
                    <span className="me-auto">{name}</span>
                    <div className="d-flex gap-1">
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => startEdit(cat)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(cat)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
