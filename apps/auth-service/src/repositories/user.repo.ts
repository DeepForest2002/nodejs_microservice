//whenever we are going to create an user we need to check if the user exists or not

import { UserRole, User } from "../types/auth.type";
import { CreatePool } from "shared";

export async function createUser(input: {
  name: string;
  email: string;
  password_hash: string;
  role?: UserRole;
}): Promise<User> {
  const pool = CreatePool();
  const result = await pool.query<User>(
    `INSERT INTO users (email, name, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, name, password_hash, role, created_at
        `,
    [input.email, input.name, input.password_hash, input.role ?? "user"],
  );
  return result.rows[0];
}

export async function findByEmail(email: string): Promise<User | null> {
  const pool = CreatePool();
  const result = await pool.query<User>(
    `SELECT id, email, name, password_hash, role, created_at FROM users WHERE email=$1`,
    [email],
  );
  return result.rows[0] ?? null;
}
