import { Request, Response, NextFunction } from "express";
import * as taskService from "../service/task.service";
import { AppError, successResponse } from "shared";

function requireIdentity(req: Request) {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");
  if (!userId || !role) {
    throw new AppError(401, "Missing user configs");
  }
  return { userId, role };
}

export async function createTaskController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = requireIdentity(req);
    const task = await taskService.createTaskService(req.body, userId);
    successResponse(res, { task }, 201);
  } catch (err) {}
}
