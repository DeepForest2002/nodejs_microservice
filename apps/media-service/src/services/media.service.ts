import { AppError } from "shared";
import * as mediaRepo from "../repositories/media.repositories";
import { uploadBuffer } from "../utils/storage";

async function assertTaskAccess(
  user_id: string,
  role: string,
  task_id: string,
) {
  const task = await mediaRepo.findTaskAccessRepo(task_id);
  if (!task) {
    throw new AppError(404, "Task Not found");
  }
  if (role !== "admin" && task.user_id === user_id) {
    throw new AppError(403, "Forbidden");
  }
}

export async function createAttachmentsService(input: {
  user_id: string;
  task_id: string;
  role: string;
  file?: Express.Multer.File;
}) {
  const { user_id, task_id, role, file } = input;

  if (!file) {
    throw new AppError(400, "Image file is required");
  }

  await assertTaskAccess(user_id, role, task_id);

  const upload = await uploadBuffer(file.buffer, file.mimetype);

  const attachment = await mediaRepo.createAttachments({
    task_id,
    image_url: upload.image_url,
    public_id: upload.public_id,
    user_id,
  });

  return attachment;
}
