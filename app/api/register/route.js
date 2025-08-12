// import { hashPassword, createSession } from "@/app/lib/auth";
// import { pool } from "@/lib/db";

// const getRoleFromEmail = (email) => {
//   // Extract the prefix before the @ symbol
//   const prefix = email.split("@")[0].toLowerCase();

//   // Define role mappings based on prefixes
//   const roleMappings = {
//     hr: "hr",
//     cc: "cc",
//     bi: "bi",
//     admin: "admin",
//   };

//   // Check if prefix matches any role
//   for (const [key, role] of Object.entries(roleMappings)) {
//     if (prefix.startsWith(key)) {
//       return role;
//     }
//   }

//   return "staff"; // Default role if no prefix matches
// };

// export async function POST(request) {
//   let client;
//   try {
//     const { name, email, password } = await request.json();

//     //Validate email domain first
//     if (!email.endsWith("@hotpoint.co.ke")) {
//       return Response.json(
//         {
//           success: false,
//           message: "Only Hotpoint emails are allowed to register.",
//         },
//         { status: 400 },
//       );
//     }

//     client = await pool.connect();

//     // Check for existing user
//     const { rows: existingUsers } = await client.query(
//       "SELECT id FROM users WHERE email = $1",
//       [email],
//     );

//     if (existingUsers.length > 0) {
//       return Response.json(
//         { success: false, message: "Email already registered" },
//         { status: 400 },
//       );
//     }

//     const role = getRoleFromEmail(email);
//     const hashedPassword = await hashPassword(password);

//     // Insert new user
//     const { rows: userResult } = await client.query(
//       `INSERT INTO users (name, email, password, role)
//        VALUES($1, $2, $3, $4)
//        RETURNING id`,
//       [name, email, hashedPassword, role],
//     );

//     await createSession(userResult[0].id, role, name, email);

//     return Response.json(
//       {
//         success: true,
//         userId: userResult[0].id,
//         role: role,
//       },
//       { status: 201 },
//     );
//   } catch (error) {
//     console.error("Registration error:", error);

//     if (error.code === "23505") {
//       // PostgreSQL duplicate key error code
//       return Response.json(
//         { success: false, message: "Email already registered" },
//         { status: 400 },
//       );
//     }

//     return Response.json(
//       { success: false, message: "Server error. Please try again." },
//       { status: 500 },
//     );
//   } finally {
//     if (client) client.release();
//   }
// }
