import { UserTokenPayload } from "./auth.type";

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload;
    }
  }
}
export {};
