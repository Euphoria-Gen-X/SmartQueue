import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { env } from "../config/env.js";

const generateToken = (userId: unknown, role: string) => {
  return jwt.sign({ userId, role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as StringValue
  });
};

export default generateToken;
