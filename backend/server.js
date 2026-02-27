import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import articleRoutes from "./routes/articleRoutes.js";
import seedRoutes from "./routes/seedRoutes.js"; // ✅ add this
import Article from "./models/Article.js";
import authRoutes from "./routes/admin-auth.js";
import adminAuthRoutes from "./routes/admin-auth.js";
import userRoutes from "./routes/userRoutes.js";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import path from "path";
import upload from "./middleware/upload.js";
import fs from "fs";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ register here
app.use("/api/articles", articleRoutes); 
app.use("/api/seed", seedRoutes);   // 👈 this is required
app.use("/api/users", userRoutes);

// ✅ CREATE new article
app.post("/api/articles", upload.single("image"), async (req, res) => {
  try {
    const { title, excerpt, content, authorName, category  } = req.body; 
    // simple validation
    if (!title || !content || !authorName || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const article = new Article({
      title,
      content,
      excerpt,
      authorName,
      category,
       image: req.file ? `/uploads/articles/${req.file.filename}` : null, 
      createdAt: new Date(),
    }); 
    await article.save();
    res.status(201).json({ message: "Article added successfully", article });
  } catch (error) {
    console.error("Error adding article:", error);
    res.status(500).json({ error: "Failed to add article" });
  }
});
// GET /api/articles/category/:category
export const getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const articles = await Article.find({ category });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
};
// DELETE /api/articles/:id
app.delete("/api/articles/:id", async (req, res) => {
  try { 
    const { id } = req.params;
     // Check if article exists
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    // If image exists, delete it from folder
    if (article.image) {
      console.log("🗑️ Deleting Image:", article.image);
      const oldImagePath = path.join(process.cwd(), article.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("🗑️ Old Image Deleted:", article.image);
      }
    } 

    // Delete article from DB
    await Article.findByIdAndDelete(id);

    res.json({ message: "Article deleted successfullyy" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "Failed to delete article" });
  }
});

// PUT /api/articles/:id
 const storage = multer.diskStorage({
  destination: "uploads/articles/",
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const uploadImg = multer({ storage });

export const updateArticle = async (req, res) => {
  
  try {
    const { id } = req.params;
    const { title, content, authorName, category } = req.body;
    if (!title || !content || !authorName || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
 const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
 let updatedData = {
      title: req.body.title, 
      authorName: req.body.authorName,
      content: req.body.content,
      category: req.body.category,
    };
 // Check if new image uploaded
    if (req.file) {
      const oldImage = article.image;

      if (oldImage) {
        const oldImagePath = path.join(process.cwd(), oldImage);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); 
        } 
      }

      // Save new image filename
      updatedData.image = `/uploads/articles/${req.file.filename}`;
    }
    const updatedArticle = await Article.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

     res.json({
      message: "Article updated and image replaced successfully",
      updatedArticle,
    });
  } catch (err) {
    console.error("Error updating article:", err);
    res.status(500).json({ message: "Server error while updating article" });
  }
};
app.put("/api/articles/:id", uploadImg.single("image"), updateArticle); 
 app.use("/uploads", express.static(path.join("uploads")));
 //app.use("/api/auth", authRoutes);
 app.use("/api/auth", adminAuthRoutes);
 


const createSuperUser = async () => {
  const existing = await User.findOne({ email: "super@example.com" });
  if (existing) return console.log("✅ Super user already exists");

  const hashedPassword = await bcrypt.hash("admin123", 10);
  const superUser = new User({
    name: "Super Admin",
    email: "super@example.com",
    password: hashedPassword,
    role: "super",
  });
  await superUser.save();
  console.log("🚀 Super user created with email: super@example.com | password: admin123");
};

createSuperUser();

// start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error(err));
