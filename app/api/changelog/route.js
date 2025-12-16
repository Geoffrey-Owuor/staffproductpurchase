import pool from "@/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(_req) {
  const { id } = await getCurrentUser();

  if (!id)
    return Response.json(
      { message: "You are not authenticated" },
      { status: 401 },
    );

  let connection;

  try {
    connection = await pool.getConnection();

    // The logic: Fetch active logs created after the user last viewed the changelog
    // COALESCE(last_changelog_viewed_at, '1970-01-01') handles new users (NULL BECOMES 1978)
    const query = `
    SELECT id, title, category, description, created_at
    FROM changelogs
    WHERE is_active = 1 AND
    created_at > (
    SELECT COALESCE(last_changelog_viewed_at, '1970-01-01')
    FROM users
    WHERE id = ?
    )
    ORDER BY created_at DESC
    `;

    const [rows] = await connection.execute(query, [id]);

    return Response.json(rows || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching changelogs:", error);
    return Response.json(
      { message: "Error fetching changelogs" },
      { status: 500 },
    );
  } finally {
    if (connection) connection.release();
  }
}

export async function PUT(_req) {
  const { id } = await getCurrentUser();

  if (!id)
    return Response.json(
      { message: "You are not authenticated" },
      { status: 401 },
    );

  let connection;

  try {
    connection = await pool.getConnection();

    // The Update: Set the user's last seen timestamp to right now after viewing a changelog;
    const query = `UPDATE users SET last_changelog_viewed_at = NOW() WHERE id = ?`;

    await connection.execute(query, [id]);

    return Response.json(
      { message: "Changelog viewed updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating changelog viewed", error);
    return Response.json(
      { message: "Error updating changelog viewed" },
      { status: 500 },
    );
  } finally {
    if (connection) connection.release();
  }
}
