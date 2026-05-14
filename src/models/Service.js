import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  duration:    { type: Number, required: true }, // in minutes
  price:       { type: Number, required: true },
  category:    { type: String, required: true },
  image:       { type: String, default: "" },
  available:   { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model("Service", serviceSchema);