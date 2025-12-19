"use server";
import pool from "@/lib/db";
import { revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

// Function to fetch changelogs from the database
const fetchChangelogs = async () => {
  try {
    const changeLogQuery = `
            SELECT id, title, category, description, created_at
            FROM changelogs
            ORDER BY created_at DESC
            `;

    const [rows] = await pool.query(changeLogQuery);

    return rows;
  } catch (error) {
    console.error("Error while fetching changelogs:", error);
    return []; //Return an empty array on error
  }
};

export const cachedChangelogs = unstable_cache(
  fetchChangelogs,
  ["changelogs"],
  { tags: ["changelogs"] },
);

// Server action to manually revalidate the changelogs path
export async function revalidateChangelogs() {
  // invalidate cached database data
  revalidateTag("changelogs");
}
