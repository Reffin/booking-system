import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("serviceId");
    const date = searchParams.get("date");

    if (!serviceId || !date)
      return NextResponse.json({ error: "serviceId and date are required" }, { status: 400 });

    const booked = await Booking.find({
      service: serviceId,
      date,
      status: { $nin: ["cancelled"] },
    }).select("time");

    return NextResponse.json(booked.map(b => b.time));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}