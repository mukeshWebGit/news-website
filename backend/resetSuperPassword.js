import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ Connected to MongoDB");

const email = "super@example.com";
const newPassword = "admin123";

const user = await User.findOne({ email });

if (user) {
  user.password = newPassword; // plain text — will be auto-hashed by pre('save')
  user.role = "super";
  await user.save();
  console.log("✅ Super user password reset successfully!");
} else {
  await User.create({
    name: "Super Admin",
    email,
    password: newPassword,
    role: "super",
  });
  console.log("✅ Super user created successfully!");
}

process.exit();
