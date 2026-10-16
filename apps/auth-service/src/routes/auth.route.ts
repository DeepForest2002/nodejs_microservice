import { Router } from "express";
import { ValidateBody } from "shared";
import { registerSchema } from "../schema/auth.schema";
import * as authController from "../controller/auth.controller";
export const AuthRouter = Router();

AuthRouter.post(
  "/register",
  ValidateBody(registerSchema),
  authController.createUserController,
);
