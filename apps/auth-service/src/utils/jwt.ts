import jwt from "jsonwebtoken";
import { UserTokenPayload } from "../types/auth.type";

export function createJwtToken(payload: UserTokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
}
