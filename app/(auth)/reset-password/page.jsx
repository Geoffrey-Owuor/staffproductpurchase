// import { Suspense } from "react";
// import ResetPasswordClient from "@/components/ResetPasswordClient";

// export default function ResetPasswordPage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <ResetPasswordClient />
//     </Suspense>
//   );
// }

import { Suspense } from "react";
import ResetPasswordClient from "@/components/ResetPasswordClient";
import { pool } from "@/lib/db";
import InvalidTokenUi from "@/components/Reusables/InvalidTokenUi";

export default async function ResetPasswordPage({ searchParams }) {
  const searchparams = await searchParams;
  const token = searchparams?.token;

  if (!token) {
    return <InvalidTokenUi />;
  }

  const client = await pool.connect();
  let isValid = false;

  try {
    const { rows: users } = await client.query(
      "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW() LIMIT 1",
      [token],
    );

    if (users.length > 0) {
      isValid = true;
    }
  } catch (error) {
    console.error("Error validating reset token:", error);
  } finally {
    client.release();
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
