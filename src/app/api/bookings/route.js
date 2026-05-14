import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let bookings;
    if (user.role === "admin") {
      bookings = await Booking.find()
        .populate("user", "name email")
        .populate("service", "name price duration")
        .sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({ user: user.id })
        .populate("service", "name price duration category")
        .sort({ createdAt: -1 });
    }

    return NextResponse.json(bookings);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { serviceId, date, time, notes, name, email, phone } = await request.json();

    if (!serviceId || !date || !time || !name || !email || !phone)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service)
      return NextResponse.json({ error: "Service not found" }, { status: 404 });

    // Check if slot is already booked
    const existing = await Booking.findOne({
      service: serviceId,
      date,
      time,
      status: { $nin: ["cancelled"] }
    });
    if (existing)
      return NextResponse.json({ error: "This time slot is already booked" }, { status: 400 });

    const booking = await Booking.create({
      user: user.id,
      service: serviceId,
      date, time, notes, name, email, phone
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}