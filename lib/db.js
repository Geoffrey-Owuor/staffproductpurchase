// db.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectTimeout: 10000,

  connectionLimit: 40, // This is the maximum number of available connections (Mysql's default)
  queueLimit: 0,
});

export default pool;
