export type UserRole = "user" | "admin";
export type UserTokenPayload = {
  userId: string;
  role: UserRole;
};
