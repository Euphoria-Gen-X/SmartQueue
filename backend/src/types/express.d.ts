import type { IUser } from "../models/User.js";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<IUser, "password">;
      allowedRoles?: string[];
    }
  }
}

export {};
