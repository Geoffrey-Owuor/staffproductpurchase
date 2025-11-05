import pool from "@/lib/db";
import { unstable_cache } from "next/cache";

//Caching Terms & Conditions
export const CachedConditions = unstable_cache(
  async () => {
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
  },
  ["all_conditions"], //Unique key for this particular cache
  { revalidate: 3600 }, //Revalidate every 1hr (3600 seconds)
);

//Caching discount policies
export const CachedPolicies = unstable_cache(
  async () => {
    let connection;
    try {
      connection = await pool.getConnection();
      const [policies] = await connection.execute(`
        SELECT policy_name, category, rate 
        FROM discountpolicies
        ORDER BY id ASC
        `);

      return policies;
    } catch (error) {
      console.error("Error fetching discount policies: ", error);
      //Empty fallback array
      return [];
    } finally {
      if (connection) connection.release();
    }
  },
  ["all_policies"],
  { revalidate: 3600 },
);

//Caching credit periods
export const CachedPeriods = unstable_cache(
  async () => {
    let connection;

    try {
      connection = await pool.getConnection();

      const [periods] = await connection.execute(`
      SELECT period_value, period_description
      FROM credit_periods
      ORDER BY period_value ASC`);

      return periods;
    } catch (error) {
      console.error("Error fetching credit periods:", error);
      //Fallback empty array
      return [];
    } finally {
      if (connection) connection.release();
    }
  },
  ["all_periods"],
  { revalidate: 3600 },
);

//Caching Approver Emails
export const CachedEmails = unstable_cache(
  async () => {
    let connection;

    try {
      connection = await pool.getConnection();

      const [emails] = await connection.execute(`
      SELECT approver_email, approver_role, approver_description
      FROM approver_emails 
      ORDER BY id ASC`);

      return emails;
    } catch (error) {
      console.error("Error fetching approver emails:", error);
      //Empty fallback array
      return [];
    } finally {
      if (connection) connection.release();
    }
  },
  ["all_approver_emails"],
  { revalidate: 3600 },
);
