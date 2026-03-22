import { Pool, type PoolClient } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
  host: "db",
  port: parseInt(process.env.POSTGRES_PORT ?? "5433"),
  database: "ticket_booking",
  user: "postgres",
  password: process.env.POSTGRES_PASSWORD,
  max: 50,
  min: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// DRIZZLE INSTANCE
export const db = drizzle(pool);

export async function healthCheck(): Promise<boolean> {
  try {
    // simple drizzle query
    const result = await db.execute("SELECT 1");

    console.log("Database health check passed");
    return true;
  } catch (error) {
    console.error("health check failed:", error);
    return false;
  }
}

export { pool };
