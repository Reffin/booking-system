import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  date:    { type: String, required: true }, // YYYY-MM-DD
  time:    { type: String, required: true }, // HH:MM
  status:  { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
  notes:   { type: String, default: "" },
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);