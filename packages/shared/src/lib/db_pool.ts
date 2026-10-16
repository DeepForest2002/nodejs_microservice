import { Pool } from "pg";
import { AppError } from "../errors/AppError";
let pool: Pool | null = null;

export function CreatePool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DB config is incorrect");
    }
    pool = new Pool({ connectionString: connectionString });
  }
  return pool;
}

export async function closeDBPool(): Promise<void> {
  if (pool) {
    await pool.end();
  }
  pool = null;
  console.log("Db pool is destroyed");
}
