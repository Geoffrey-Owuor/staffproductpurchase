// import { getCurrentUser } from "@/app/lib/auth";

// export async function GET() {
//   try {
//     const user = await getCurrentUser();
//     if (!user) {
//       return Response.json({ name: null }, { status: 200 });
//     }
//     return Response.json({ name: user.name }, { status: 200 });
//   } catch (error) {
//     return Response.json({ name: null }, { status: 500 });
//   }
// }

import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }
    return NextResponse.json(
      { name: user.name, role: user.role, id: user.id, valid: true },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ name: null }, { status: 500 });
  }
}
