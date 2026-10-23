import { AppError } from "../errors/AppError";
import { UserTokenPayload } from "./auth.type";
import jwt from "jsonwebtoken";
export function SignInToken(payload: UserTokenPayload): string {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });
  return token;
}

export function verifyToken(token: string): UserTokenPayload {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);

  if (
    typeof decodedToken !== "object" ||
    decodedToken === null ||
    typeof decodedToken.userId !== "string" ||
    (decodedToken.role !== "user" && decodedToken.role !== "admin")
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    userId: decodedToken.userId,
    role: decodedToken.role,
  };
}
