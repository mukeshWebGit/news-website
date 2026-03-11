import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
   // author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   authorName: { type: String, required: true },
   image: { type: String, default: null },
   createdAt: { type: Date, default: Date.now },
     category: {
    type: String,
    enum: ["Politics", "Sports", "Technology", "Business", "Entertainment", "World", "Lifestyle"],
    required: true
  },
  },
  { timestamps: true } // createdAt, updatedAt
);

// helpful index for "latest"
articleSchema.index({ createdAt: -1 });

export default mongoose.model("Article", articleSchema);
