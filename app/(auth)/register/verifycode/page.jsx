import { redirect } from "next/navigation";
import pool from "@/lib/db";
import VerifyCodeComponent from "@/components/RegistrationComponents/VerifyCodeComponent";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function Step2Page() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("verify_email")?.value;
  if (!cookie) return redirect("/register");

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(cookie, secret);
    const email = payload.email;

    if (!email) return redirect("/register");

    const [results] = await pool.execute(
      `SELECT * FROM verification_codes
         WHERE email = ? and verified = 0 and expires_at > NOW()`,
      [email],
    );

    if (results.length === 0) {
      return redirect("/register");
    }

    return <VerifyCodeComponent email={email} />;
  } catch (error) {
    console.error(error);
    return redirect("/register");
  }
}
