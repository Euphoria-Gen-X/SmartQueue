import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import User from "../models/User.js";

type AuthTokenPayload = jwt.JwtPayload & {
  userId: string;
  role: string;
};

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401);
    next(new Error("Not authorized, token missing"));
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      res.status(401);
      next(new Error("Not authorized, user not found"));
      return;
    }

    next();
  } catch (_error) {
    res.status(401);
    next(new Error("Not authorized, token invalid"));
  }
};
