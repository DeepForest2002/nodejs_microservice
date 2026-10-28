export type TaskStatus = "pending" | "in_progress" | "resolved" | "closed";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  user_id: string;
  created_at: string;
};
