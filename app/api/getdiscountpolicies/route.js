import { pool } from "@/lib/db";

export async function GET() {
  let client;
  try {
    client = await pool.connect();

    const { rows } = await client.query(`
            SELECT policy_name, category, rate FROM discountpolicies
            `);
    return Response.json({ data: rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching discount policies: ", error);
    return Response.json(
      { message: "Error fetching discount policies" },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
