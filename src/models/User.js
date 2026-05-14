import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ["user", "admin"], default: "user" },
  phone:    { type: String, trim: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);