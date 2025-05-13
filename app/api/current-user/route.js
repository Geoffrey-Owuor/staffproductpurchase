import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ name: null }, { status: 200 });
    }
    return Response.json({ name: user.name }, { status: 200 });
  } catch (error) {
    return Response.json({ name: null }, { status: 500 });
  }
}
