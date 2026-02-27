import express from "express";
import { protect, superOnly } from "../middleware/admin-auth.js";
import {
  listLatestArticles,
  getArticleById,
  addArticle,
  updateArticle,
  deleteArticle
} from "../controllers/articleController.js";

const router = express.Router();

// ✅ Public routes
router.get("/", listLatestArticles);
router.get("/:id", getArticleById);

// ✅ Protected routes
router.post("/", protect, addArticle);
router.put("/:id", protect, updateArticle);
router.delete("/:id", protect, deleteArticle);

export default router;