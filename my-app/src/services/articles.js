const API = "http://localhost:5000/api/articles";

export async function fetchLatestArticles(page = 1, limit = 10) {
  const res = await fetch(`${API}?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load articles");
  return res.json();
}
