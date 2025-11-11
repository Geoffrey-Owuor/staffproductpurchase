// app/(auth)/reset-password/page.jsx or page.tsx
import { Suspense } from "react";
import ResetPasswordClient from "@/components/ResetPasswordClient";
import InvalidTokenUi from "@/components/Reusables/InvalidTokenUi";
import pool from "@/lib/db";

export default async function ResetPasswordPage({ searchParams }) {
  const searchparams = await searchParams;
  const token = searchparams?.token;

  if (!token) {
    return <InvalidTokenUi />;
  }

  let conn;
  let isValid = false;

  try {
    conn = await pool.getConnection();
    const [users] = await conn.execute(
      "SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()",
      [token],
    );

    if (users.length > 0) {
      isValid = true;
    }
  } catch (error) {
    console.error("Error validating reset token:", error);
  } finally {
    if (conn) conn.release();
  }

  if (!isValid) {
    return <InvalidTokenUi />;
  }

  // Only render client component if token is valid
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-lg">Loading reset form...</p>
        </div>
      }
    >
      <ResetPasswordClient token={token} />
    </Suspense>
  );
}
