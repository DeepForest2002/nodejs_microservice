import { CreatePool } from "shared";
import { Attachment } from "../utils/media-types";
export async function createAttachments(input: {
  task_id: string;
  image_url: string;
  public_id: string;
  user_id: string;
}): Promise<Attachment | null> {
  const pool = CreatePool();
  const result = await pool.query<Attachment>(
    `INSERT INTO attachments (task_id, image_url, public_id, user_id) VALUES ($1, $2, $3, $4) RETURNING id, task_id, image_url, public_id, user_id, created_at`,
    [input.task_id, input.image_url, input.public_id, input.user_id],
  );
  return result.rows[0] ?? null;
}
