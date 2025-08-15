import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import VerifyCodeComponent from "@/components/RegistrationComponents/VerifyCodeComponent";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function Step2Page() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("verify_email")?.value;

  if (!cookie) redirect("/register");

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(cookie, secret);

    const email = payload.email;

    if (!email) redirect("/register");

    const client = await pool.connect();
    const { rows: results } = await client.query(
      `SELECT * FROM verification_codes
       WHERE email = $1 AND verified = 0 AND expires_at > NOW()`,
      [email],
    );
    client.release();

    if (results.length === 0) {
      redirect("/register");
    }

    return <VerifyCodeComponent email={email} />;
  } catch (error) {
    console.error("An error occured in step 2 page: ", error);
    redirect("/register");
  }
}
