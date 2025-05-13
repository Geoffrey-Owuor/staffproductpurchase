import { getCurrentUser } from "@/app/lib/auth";

export const dynamic = "force-dynamic"; // Ensure no caching

export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ valid: false }, { status: 401 });
    }

    return Response.json({
      valid: true,
      role: user.role, // Include role in response
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Session validation error:", error);
    return Response.json(
      {
        valid: false,
        error: "Session validation failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
