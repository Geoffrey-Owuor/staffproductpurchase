//Test api for generating a valid session cookie
import { createSession } from "@/app/lib/auth";

export async function POST(request) {
  try {
    //Pass json body from the request
    const { userId, role, name, email, payrollNo, department } =
      await request.json();

    //Check if the required fields are present
    if (!userId || !role || !name) {
      return Response.json(
        { message: "Missing required fields (id, role, name)" },
        { status: 400 },
      );
    }

    //Call the create session to create a cookie
    await createSession(userId, role, name, email, payrollNo, department);

    //Cookie is now set on the response object
    return Response.json(
      { message: "Session cookie created successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Session creation error:", error);
    return Response.json(
      { message: "Failed to create session cookie" },
      { status: 500 },
    );
  }
}
