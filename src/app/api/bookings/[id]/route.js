import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import { verifyToken } from "@/lib/auth";

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const user = verifyToken(request);
    if (!user || user.role !== "admin")
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const { status } = await request.json();
    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    ).populate("service", "name price duration");

    if (!booking)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    return NextResponse.json(booking);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const user = verifyToken(request);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const booking = await Booking.findById(params.id);
    if (!booking)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    // Only admin or the booking owner can cancel
    if (user.role !== "admin" && booking.user.toString() !== user.id)
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    await Booking.findByIdAndUpdate(params.id, { status: "cancelled" });
    return NextResponse.json({ message: "Booking cancelled" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}