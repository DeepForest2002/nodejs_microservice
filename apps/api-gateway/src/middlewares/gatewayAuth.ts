import { Request, Response, NextFunction } from "express";
import { AppError, verifyToken } from "shared";
import { getAllowedRoles, isPublicRoutes } from "../rbac";

//main middleware to run on every auth
// runs before the proxy and strip away every identity headers

const IDENTITY_HEADERS = ["x-user-id", "x-user-role", "x-gateway-secret"];

// we will not trust any kind of headers recieved from the client so we strip out all the headers

export function stripIdentityHeaders(req: Request) {
  for (const header of IDENTITY_HEADERS) {
    delete req.headers[header];
  }
}

function attachGatewaySecret(req: Request) {
  const secret = process.env.GATEWAY_SECRET;
  if (!secret) {
    throw new AppError(500, "Gateway secret is not configured");
  }

  req.headers["x-gateway-secret"] = secret;
}

function requestPath(req: Request) {
  const combined = `${req.baseUrl}${req.path}`;
  if (combined.length > 1 && combined.endsWith("/")) {
    return combined.slice(0, 1);
  }
  return combined || "/";
}

function attachUserHeaders(req: Request, userId: string, role: string) {
  req.headers["x-user-id"] = userId;
  req.headers["x-user-role"] = role;
}

export function gatewayAuth(req: Request, res: Response, next: NextFunction) {
  try {
    stripIdentityHeaders(req);
    attachGatewaySecret(req);
    const path = requestPath(req);
    if (isPublicRoutes(req.method, path)) {
      return next();
    }

    const authHeader = req.header("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "Missing auth token");
    }
    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    //RBAC CONCEPT = is this role allowed on this path
    const allowedRoles = getAllowedRoles(req.method, path);
    if (!allowedRoles) {
      throw new AppError(404, "Route not found");
    }

    //forbidden
    if (!allowedRoles.includes(payload.role)) {
      throw new AppError(403, "Forbidden routes");
    }

    //attaching user headers
    attachUserHeaders(req, payload.userId, payload.role);
    next();
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }
    return next(new AppError(401, "Invalid or expired token"));
  }
}
