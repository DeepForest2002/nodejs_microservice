import { Request, Response, NextFunction } from "express";
import { AppError } from "shared";

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
    const { userId, role } = getuserIdentity(req);
  } catch (err) {
    next(err);
  }
}
