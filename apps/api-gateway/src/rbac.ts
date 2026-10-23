import { match } from "node:assert";
import type { UserRole } from "shared";

export type RbacRule = {
  method: string;
  path: string;
  roles: UserRole[];
};

export const publicRoutes = [
  {
    method: "POST",
    path: "/auth/register",
  },
  {
    method: "POST",
    path: "/auth/login",
  },
] as const;

export const rbacRules: RbacRule[] = [
  {
    method: "GET",
    path: "/auth/me",
    roles: ["user", "admin"],
  },
];

/*
    path matching= /auth/me == /auth/me
    second= /tickets/:id == /tickets/anc-124 split them
    "","tickets",":id" and "","tickets","anc-124"
*/

export function matchpath(pattern: string, actual: string): boolean {
  if (pattern === actual) return true;
  const patternParts = pattern.split("/");
  const actualParts = actual.split("/");

  if (patternParts.length !== actualParts.length) return false;

  return patternParts.every(
    (part, index) => part.startsWith(":id") || part === actualParts[index],
  );
}

export function isPublicRoutes(method: string, path: string) {
  return publicRoutes.some(
    (route) => method === route.method && matchpath(route.path, path),
  );
}

export function getAllowedRoles(
  method: string,
  path: string,
): UserRole[] | null {
  const rules = rbacRules.find(
    (currentItem) =>
      currentItem.method === method && matchpath(currentItem.path, path),
  );

  return rules?.roles ?? null;
}
