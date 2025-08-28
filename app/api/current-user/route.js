import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }
    return NextResponse.json(
      {
        name: user.name,
        role: user.role,
        email: user.email,
        id: user.id,
        valid: true,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ name: null }, { status: 500 });
  }
}
