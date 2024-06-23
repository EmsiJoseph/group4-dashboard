import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

export async function query(q: string, values: any[] = []) {
  try {
    console.log("Connecting to database...");
    const client = await pool.connect();
    try {
      const res = await client.query(q, values);
      console.log("Database query successful:", res.rows);
      return res.rows;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
