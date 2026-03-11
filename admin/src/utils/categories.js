const API_BASE = "http://localhost:5000/api/categories";

export const DEFAULT_CATEGORIES = [
  "Politics",
  "Sports",
  "Technology",
  "Business",
  "Entertainment",
  "World",
  "Lifestyle",
];

/** Fetch categories from API. Returns array of { _id, name }; uses DEFAULT_CATEGORIES as names on failure. */
export async function fetchCategories() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) return DEFAULT_CATEGORIES.map((name, i) => ({ _id: `fallback-${i}`, name }));
    const json = await res.json();
    const list = json?.data;
    if (!Array.isArray(list) || !list.length) return DEFAULT_CATEGORIES.map((name, i) => ({ _id: `fallback-${i}`, name }));
    return list.map((c) => {
      if (typeof c === "string") return { _id: c, name: c };
      const id = c._id != null ? String(c._id) : c.name;
      return { _id: id, name: c.name || c };
    });
  } catch {
    return DEFAULT_CATEGORIES.map((name, i) => ({ _id: `fallback-${i}`, name }));
  }
}

/** Add a new category in the database. Returns updated list; throws on error. */
export async function addCategory(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) throw new Error("Category name is required");

  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: trimmed }),
  });

  let data = {};
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (!res.ok) throw new Error(text || `Server error (${res.status})`);
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || text || `Failed to add category (${res.status})`;
    throw new Error(msg);
  }

  const list = await fetchCategories();
  return list;
}

/** Update category by id. Returns updated list; throws on error. */
export async function updateCategory(id, name) {
  const trimmed = (name || "").trim();
  if (!trimmed) throw new Error("Category name is required");

  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: trimmed }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to update category");

  return fetchCategories();
}

/** Delete category by id. Returns updated list; throws if in use by articles. */
export async function deleteCategory(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to delete category");
  return fetchCategories();
}

// Legacy sync helpers for backward compatibility (e.g. initial state)
export const loadCategories = () => DEFAULT_CATEGORIES.map((name, i) => ({ _id: `default-${i}`, name }));
export const saveCategories = () => {};
