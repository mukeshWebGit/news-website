import Article from "../models/Article.js";
import fs from "fs";
import path from "path";
const makeExcerpt = (text = "", limit = 160) => {
  if (text.length <= limit) return text;
  return text.slice(0, limit).trim() + "…";
};

// ✅ GET /api/articles?page=1&limit=10
export const listLatestArticles = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Article.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("title content createdAt authorName image category"), // ✅ no populate
      Article.countDocuments(),
    ]);

    const data = items.map((a) => ({
      id: a._id,
      title: a.title,
      image: a.image,
      category: a.category,
      excerpt: makeExcerpt(a.content, 180),
      authorName: a.authorName || "Unknown", // ✅ use authorName directly
      createdAt: a.createdAt,
    }));

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (err) {
    console.error("List articles error:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching articles" });
  }
};

// ✅ GET /api/articles/:id
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id).select(
      "title content authorName createdAt image"
    ); // ✅ no populate

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json({
      id: article._id,
      title: article.title,
      content: article.content,
      category: article.category,
      image: article.image,
      authorName: article.authorName || "Unknown",
      createdAt: article.createdAt,
    });
  } catch (err) {
    console.error("Error fetching article:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ DELETE /api/articles/:id
export const deleteArticle = async (req, res) => {
  const { id } = req.params;
  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Invalid article ID" });
  }

  try {
    const deleted = await Article.findById(id); 
    if (!deleted) return res.status(404).json({ message: "Article not found" });

 // If image exists, delete it from folder
    if (deleted.image) {
      const oldImagePath = path.join(process.cwd(), deleted.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("🗑️ Old Image Deleted:", deleted.image);
      }
    }
    // Delete article from DB
    await Article.findByIdAndDelete(id);  
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete article" });
  }
};