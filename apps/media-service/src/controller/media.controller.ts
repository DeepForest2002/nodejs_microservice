import { Request, Response, NextFunction } from "express";
import { AppError, successResponse } from "shared";
import * as mediaService from "../services/media.service";
function getuserIdentity(req: Request) {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");
  if (!userId || !role) {
    throw new AppError(401, "missing user configs");
  }
  return { userId, role };
}

export async function uploadAttachmentController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log("comes under media controller");
    const { userId, role } = getuserIdentity(req);
    // media/:taskid
    const taskId = String(req.params.taskId);
    if (!req.file) {
      throw new AppError(400, "Image file is required");
    }

    const attachment = await mediaService.createAttachmentsService({
      user_id: userId,
      task_id: taskId,
      role,
      file: req.file,
    });
    successResponse(res, { attachment }, 201);
  } catch (err) {
    next(err);
  }
}
