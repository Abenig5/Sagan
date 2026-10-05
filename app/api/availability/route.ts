import { NextRequest, NextResponse } from "next/server";
import { dayAvailability, monthAvailability } from "@/lib/booking";

// Public availability endpoint. Only ever returns free/booked/unavailable
// per slot — never client names (see README "Availability Rules").
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const month = req.nextUrl.searchParams.get("month"); // YYYY-MM-01

  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "invalid date" }, { status: 400 });
    const result = await dayAvailability(date);
    return NextResponse.json(result);
  }

  if (month) {
    if (!/^\d{4}-\d{2}-01$/.test(month)) return NextResponse.json({ error: "invalid month" }, { status: 400 });
    const result = await monthAvailability(month);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "date or month required" }, { status: 400 });
}
