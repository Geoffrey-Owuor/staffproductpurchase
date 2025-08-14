export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import CompleteRegistrationComponent from "@/components/RegistrationComponents/CompleteRegistrationComponent";

export default async function Step3Page({ searchParams }) {
  const { email } = await searchParams;

  if (!email) {
    redirect("/register");
  }

  const client = await pool.connect();

  const { rows: results } = await client.query(
    `SELECT * FROM verification_codes
     WHERE email = $1 AND verified = 1 AND expires_at > NOW()`,
    [email],
  );

  client.release();

  if (results.length === 0) {
    redirect("/register");
  }

  return <CompleteRegistrationComponent email={email} />;
}
