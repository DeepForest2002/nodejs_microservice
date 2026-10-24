import { Request, Response, NextFunction } from "express";
import * as authService from "../service/auth.service";
import { AppError, successResponse } from "shared";
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

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = await authService.loginUserService(req.body);
    successResponse(res, { token }, 201);
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.header("x-user-id");
    if (!userId) {
      throw new AppError(401, "x-user-id is not present");
    }
    const user = await authService.getMeService(userId);
    successResponse(res, { user }, 200);
    console.log(user);
  } catch (err) {
    next(err);
  }
}
