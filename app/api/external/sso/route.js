import { NextResponse } from "next/server";
import { createSession } from "@/app/lib/auth";
import { getCurrentUser } from "@/app/lib/auth";
import crypto from "crypto";
import { REDIRECT_DASHBOARD_LINKS } from "@/public/assets";
import pool from "@/lib/db";

export async function GET(request) {
  // 1. Inspect headers sent by Nginx, falling back to local headers if accessed directly
  const proto = request.headers.get("x-forwarded-proto") || "http";
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "127.0.0.1:4000";

  // 2. Mathematically construct the exact base URL the user is currently using
  // Embedded via Nginx:   https://192.168.0.27:4443
  // Accessed Directly:    http://192.168.0.27:10556
  const baseUrl = `${proto}://${host}`;

  try {
    const { searchParams } = new URL(request.url);

    const email = searchParams.get("email");
    const timestamp = searchParams.get("timestamp");
    const signature = searchParams.get("signature");

    if (!email || !timestamp || !signature) {
      return NextResponse.redirect(new URL("/login", baseUrl));
    }

    // 1. Prevent Replay Attacks (e.g., link expires in 60 seconds)
    const now = Date.now();
    const timeDiff = now - parseInt(timestamp, 10);
    if (timeDiff > 60000 || timeDiff < 0) {
      return NextResponse.redirect(new URL("/login", baseUrl));
    }

    // 2. Recreate the signature using the shared secret
    const secret = process.env.SSO_SHARED_SECRET;
    const dataToSign = `${email}:${timestamp}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(dataToSign)
      .digest("hex");

    // 3. Compare signatures
    if (signature !== expectedSignature) {
      return NextResponse.redirect(new URL("/login", baseUrl));
    }

    // If there is already a valid session of the user available,
    // redirect directly to their dashboard
    const existingSession = await getCurrentUser();
    if (existingSession.valid) {
      const redirectLink =
        `/${REDIRECT_DASHBOARD_LINKS[existingSession.role]}` || "/login";

      return NextResponse.redirect(new URL(redirectLink, baseUrl));
    }

    // Check if the user exists or not
    const [user] = await pool.execute(
      `SELECT id, name, payrollNo, department, role FROM users WHERE email = ? LIMIT 1`,
      [email],
    );

    // No user found
    if (user.length === 0) {
      return NextResponse.redirect(new URL("/login", baseUrl));
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

    // Success: redirect the user to their designated dashboard
    const redirectLink =
      `/${REDIRECT_DASHBOARD_LINKS[userObject.role]}` || "/login";
    return NextResponse.redirect(new URL(redirectLink, baseUrl));
  } catch (error) {
    console.error("Error while trying to create the user session:", error);
    return NextResponse.redirect(new URL("/login", baseUrl));
  }
}
