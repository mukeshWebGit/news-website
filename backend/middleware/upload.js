import multer from "multer";
import path from "path";

// Storage Settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/articles"); // folder where image will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // rename file
  },
});

// File Filter (Optional: Allow only images)
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files allowed"));
};

const upload = multer({ storage, fileFilter });

export default upload;
