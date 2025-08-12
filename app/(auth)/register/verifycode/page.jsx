import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import VerifyCodeComponent from "@/components/RegistrationComponents/VerifyCodeComponent";

export default async function Step2Page({ searchParams }) {
  const params = await searchParams;
  const email = params.email;

  if (!email) {
    redirect("/register");
  }

  const client = await pool.connect();

  const { rows: results } = await client.query(
    `SELECT * FROM verification_codes
   WHERE email = $1 AND expires_at > NOW()`,
    [email],
  );

  client.release();

  if (results.length === 0) {
    redirect("/register");
  }

  return <VerifyCodeComponent email={email} />;
}
