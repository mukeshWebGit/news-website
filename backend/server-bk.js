import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";  

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// existing
app.use("/api/auth", authRoutes);

// NEW: articles
app.use("/api/articles", articleRoutes);
// other middlewares
app.use("/api/seed", seedRoutes); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));





