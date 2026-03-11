import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true, collection: "categories" }
);

categorySchema.index({ name: 1 });

export default mongoose.model("Category", categorySchema);
