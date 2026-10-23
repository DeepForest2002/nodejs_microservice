export type UserRole = "user" | "admin";

export type User = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
};

export type UserTokenPayload = {
  userId: string;
  role: UserRole;
};
