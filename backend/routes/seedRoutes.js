import express from "express";
import { seedArticles } from "../controllers/seedController.js";

const router = express.Router();

// use GET for browser testing
router.get("/articles", seedArticles);

export default router;
