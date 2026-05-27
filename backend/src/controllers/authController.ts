import type { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { successResponse } from "../utils/apiResponse.js";
import { env } from "../config/env.js";

const formatAuthUser = (user: { _id: unknown; name: string; email: string; phone?: string; role: string }) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  token: generateToken(user._id, user.role)
});

const formatPublicUser = (user: { _id: unknown; name: string; email: string; phone?: string; role: string }) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role
});

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "customer"
    });

    return successResponse(res, 201, "Registration successful. Please log in.", formatPublicUser(user));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const allowedRoles = req.allowedRoles;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      res.status(403);
      throw new Error("Access denied for this portal");
    }

    return successResponse(res, 200, "Login successful", formatAuthUser(user));
  } catch (error) {
    next(error);
  }
};

/** Admin login: env credentials first, then DB user with admin/staff role. */
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email).toLowerCase().trim();

    if (
      normalizedEmail === env.adminEmail.toLowerCase() &&
      password === env.adminPassword
    ) {
      let user = await User.findOne({ email: env.adminEmail.toLowerCase() });

      if (!user) {
        user = await User.create({
          name: "SmartQueue Admin",
          email: env.adminEmail.toLowerCase(),
          phone: "0000000000",
          password: env.adminPassword,
          role: "admin"
        });
      } else if (user.role !== "admin") {
        user.role = "admin";
        await user.save();
      }

      return successResponse(res, 200, "Admin login successful", formatAuthUser(user));
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid admin credentials");
    }

    if (!["admin", "staff"].includes(user.role)) {
      res.status(403);
      throw new Error("Access denied for admin portal");
    }

    return successResponse(res, 200, "Admin login successful", formatAuthUser(user));
  } catch (error) {
    next(error);
  }
};

export const getProfile = (req: Request, res: Response) => {
  return successResponse(res, 200, "Profile fetched", req.user);
};

export const logoutUser = (_req: Request, res: Response) => {
  return successResponse(res, 200, "Logout successful", null);
};
