// db.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 100, // This is the maximum number of available connections
  queueLimit: 0,

  // Handling idle timeouts
  maxIdle: 10, //Maximum idle threads/connections
  idleTimeout: 30000, //30 seconds in milliseconds
});

export default pool;
