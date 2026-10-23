import { Router } from "express";
import { ValidateBody } from "shared";
import { loginSchema, registerSchema } from "../schema/auth.schema";
import * as authController from "../controller/auth.controller";
export const AuthRouter = Router();

AuthRouter.post(
  "/register",
  ValidateBody(registerSchema),
  authController.createUserController,
);

AuthRouter.post("/login", ValidateBody(loginSchema), authController.loginUser);
AuthRouter.get("/me", authController.getMe);
