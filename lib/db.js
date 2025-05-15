import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function query(queryString, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(queryString, params);
    return result.rows;
  } finally {
    client.release();
  }
}

export { pool };
