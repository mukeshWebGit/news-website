import Category from "../models/Category.js";
import Article from "../models/Article.js";

// GET /api/categories – list all categories (_id + name, sorted)
export const listCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).select("_id name").lean();
    const data = categories.map((c) => ({ _id: String(c._id), name: c.name }));
    return res.json({ success: true, data });
  } catch (err) {
    console.error("List categories error:", err);
    return res.status(500).json({ message: "Server error while fetching categories" });
  }
};

// POST /api/categories – add new category
export const addCategory = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Category already exists", name: existing.name });
    }

    const category = new Category({ name });
    await category.save();
    return res.status(201).json({ success: true, category: { name: category.name, _id: category._id } });
  } catch (err) {
    console.error("Add category error:", err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Category already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message || "Invalid category" });
    }
    return res.status(500).json({ message: err.message || "Server error while adding category" });
  }
};

// PUT /api/categories/:id – update category name (and update articles using it)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const name = (req.body.name || "").trim();
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const oldName = category.name;
    if (oldName === name) {
      return res.json({ success: true, category: { _id: category._id, name } });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Category name already exists" });
    }

    category.name = name;
    await category.save();

    // Update all articles that used the old category name
    await Article.updateMany({ category: oldName }, { $set: { category: name } });

    return res.json({ success: true, category: { _id: category._id, name } });
  } catch (err) {
    console.error("Update category error:", err);
    return res.status(500).json({ message: "Server error while updating category" });
  }
};

// DELETE /api/categories/:id – delete category (blocked if in use by articles)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const count = await Article.countDocuments({ category: category.name });
    if (count > 0) {
      return res.status(400).json({
        message: `Cannot delete: this category is used by ${count} article(s). Remove or reassign them first.`,
      });
    }

    await Category.findByIdAndDelete(id);
    return res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.error("Delete category error:", err);
    return res.status(500).json({ message: "Server error while deleting category" });
  }
};
