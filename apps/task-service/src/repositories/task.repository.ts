import { CreatePool } from "shared";
import { Task, TaskStatus } from "../types/task.type";

export async function createTaskRepo(input: {
  title: string;
  user_id: string;
}): Promise<Task | null> {
  const pool = CreatePool();
  const result = await pool.query<Task>(
    `INSERT INTO tasks (title, user_id)
        VALUES ($1, $2) RETURNING id, title, status, user_id, created_at
    `,
    [input.title, input.user_id],
  );
  return result.rows[0] ?? null;
}

export async function getAllTasks(input: {
  user_id: string;
  role: string;
  limit: number;
}): Promise<Task[] | null> {
  const pool = CreatePool();
  if (input.role === "admin") {
    const result = await pool.query<Task>(
      `SELECT id, title, status, user_id, created_at FROM tasks ORDER BY created_at DESC LIMIT $1`,
      [input.limit],
    );
    return result.rows ?? null;
  }
  const result = await pool.query<Task>(
    `
        SELECT id, title, stauts, user_id, created_at
        FROM tasks
        WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2
        `,
    [input.user_id, input.limit],
  );
  return result.rows ?? null;
}

export async function getSingleTaskById(taskId: string): Promise<Task | null> {
  const pool = CreatePool();
  const result = await pool.query<Task>(
    `
    SELECT id, title, status, user_id, created_at FROM tasks WHERE id=$1
    `,
    [taskId],
  );
  return result.rows[0] ?? null;
}

export async function updateTask(input: {
  title: string;
  user_id: string;
}): Promise<Task | null> {
  const pool = CreatePool();
  const result = await pool.query<Task>(
    `UPDATE tasks SET title=$1 WHERE user_id=$2`,
    [input.title, input.user_id],
  );
  return result.rows[0] ?? null;
}
