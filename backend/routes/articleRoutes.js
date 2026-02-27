import express from "express";
import { deleteArticle, listLatestArticles } from "../controllers/articleController.js"; 
import { getArticleById } from "../controllers/articleController.js";

const router = express.Router();

// RESTful listing for home page
router.get("/", listLatestArticles);
router.get("/:id", getArticleById); 
router.delete("/:id", deleteArticle); 
export default router;


