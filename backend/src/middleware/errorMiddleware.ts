import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/apiResponse.js";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  next(new Error(`Not found: ${req.originalUrl}`));
};

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if ((error as Error & { code?: number }).code === 11000) {
    return errorResponse(res, 409, "The selected slot or queue token is no longer available");
  }

  const statusCode =
    (error as Error & { statusCode?: number }).statusCode ||
    (res.statusCode === 200 ? 500 : res.statusCode);

  return errorResponse(res, statusCode, error.message);
};
