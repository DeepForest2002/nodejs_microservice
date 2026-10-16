import { Request, Response, NextFunction } from "express";
import * as authService from "../service/auth.service";
import { successResponse } from "shared";

export async function createUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await authService.createUserService(req.body);
    successResponse(res, { user }, 201);
  } catch (error) {
    next(error);
  }
}
