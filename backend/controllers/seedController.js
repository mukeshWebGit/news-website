import Article from "../models/Article.js";
import User from "../models/User.js";

export const seedArticles = async (req, res) => {
  try {
    let author = await User.findOne();
    if (!author) {
      author = await User.create({
        name: "Test Author",
        email: "author@test.com",
        password: "hashedpassword", // in real app: hash
      });
    }

    await Article.deleteMany({}); // clear old

    const articles = await Article.insertMany([
      { title: "AI Revolution in 2025", content: "AI is transforming...", author: author._id },
      { title: "Sports Update: India Wins", content: "India won the match...", author: author._id },
      { title: "Sports Update: India Wins", content: "India won the match...", author: author._id },
      { title: "Test", content: "testing to add news...", author: author._id }
    ]);

    res.json({ message: "✅ Seeded", count: articles.length, articles });
  } catch (err) {
    console.error("Seed error:", err);
    res.status(500).json({ message: "Server error seeding articles" });
  }
};
