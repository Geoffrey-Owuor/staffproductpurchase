import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import VerifyCodeComponent from "@/components/RegistrationComponents/VerifyCodeComponent";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function Step2Page() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("verify_email")?.value;
  console.log(
    "1. Cookie value received on page:",
    cookie ? "Exists" : "MISSING",
  ); // Check if cookie is read

  if (!cookie) redirect("/register");

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(cookie, secret);
    console.log("3. JWT verified successfully. Payload:", payload); // Check if JWT verification works
    const email = payload.email;

    if (!email) redirect("/register");

    const client = await pool.connect();
    const { rows: results } = await client.query(
      `SELECT * FROM verification_codes
       WHERE email = $1 AND verified = 0 AND expires_at > NOW()`,
      [email],
    );
    client.release();

    console.log("4. DB query results length:", results.length); // Check if DB query returns a code

    if (results.length === 0) {
      redirect("/register");
    }

    return <VerifyCodeComponent email={email} />;
  } catch (error) {
    console.error("An error occured in step 2 page: ", error);
    redirect("/register");
  }
}
