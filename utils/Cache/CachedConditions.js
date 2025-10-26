import pool from "@/lib/db";
import { cache } from "react";

export const CachedConditions = cache(async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT condition_id, condition_description
             FROM terms_conditions
             ORDER by condition_id ASC`,
    );
    return rows;
  } catch (error) {
    console.error("Database Error: Failed to fetch conditions:", error);
    //Returning an empty array as a fallback
    return [];
  } finally {
    if (connection) connection.release();
  }
});
