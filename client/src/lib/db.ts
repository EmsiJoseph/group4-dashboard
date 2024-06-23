import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(q: string, values: any[] = []) {
  try {
    console.log("Connecting to database...");
    const [results] = await pool.query(q, values);
    console.log("Database query successful:", results);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
