import { NextResponse } from "next/server";
import { createSession } from "@/app/lib/auth";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);

    const embeddingSecret = searchParams.get("secret");
    const email = searchParams.get("email");

    if (embeddingSecret !== process.env.COOKIE_EMBEDDING_SECRET) {
      return NextResponse.json(
        { message: "Wrong Secret Provided" },
        { status: 400 },
      );
    }

    // Check if the user exists or not
    const [user] = await pool.execute(
      `SELECT id, name, payrollNo, department, role FROM users WHERE email = ? LIMIT 1`,
      [email],
    );

    if (user.length === 0) {
      return NextResponse.json(
        { message: "Could not find a user with the selected email" },
        { status: 404 },
      );
    }

    // User exists assign the user object
    const userObject = user[0];

    //Create the user session
    await createSession(
      userObject.id,
      userObject.role,
      userObject.name,
      email,
      userObject.payrollNo,
      userObject.department,
    );

    // Success response message
    return NextResponse.json(
      { message: "User session created successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error while trying to create the user session:", error);
    return NextResponse.json(
      { message: "Error while trying to create the user session" },
      { status: 500 },
    );
  }
}
