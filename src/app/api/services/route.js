import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({ available: true }).sort({ createdAt: -1 });
    return NextResponse.json(services);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const user = verifyToken(request);
    if (!user || user.role !== "admin")
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const body = await request.json();
    const { name, description, duration, price, category } = body;

    if (!name || !description || !duration || !price || !category)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    const service = await Service.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}