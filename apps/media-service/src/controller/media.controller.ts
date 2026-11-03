import { Request, Response, NextFunction } from "express";
import { AppError, successResponse } from "shared";
import * as mediaService from "../services/media.service";
function getuserIdentity(req: Request) {
  const user_id = req.header("x-user-id");
  const role = req.header("x-user-role");
  if (!user_id || !role) {
    throw new AppError(401, "missing user configs");
  }
  return { user_id, role };
}

export async function uploadAttachmentController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log("comes under media controller");
    const { user_id, role } = getuserIdentity(req);
    // media/:taskid
    const taskId = String(req.params.taskId);
    if (!req.file) {
      throw new AppError(400, "Image file is required");
    }

    const attachment = await mediaService.createAttachmentsService({
      user_id: user_id,
      task_id: taskId,
      role,
      file: req.file,
    });
    successResponse(res, { attachment }, 201);
  } catch (err) {
    next(err);
  }
}

export async function getAllAttachmentsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { user_id } = getuserIdentity(req);
    const mediaResults = await mediaService.getAllAttachmentService(user_id);
    successResponse(res, { mediaResults });
  } catch (err) {
    next(err);
  }
}
