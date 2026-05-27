import type { NextFunction, Request, Response } from "express";
import Service from "../models/Service.js";
import { successResponse } from "../utils/apiResponse.js";

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await Service.create(req.body);
    return successResponse(res, 201, "Consultation type created", service);
  } catch (error) {
    next(error);
  }
};

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeInactive = req.user?.role === "admin" && req.query.includeInactive === "true";
    const filter = includeInactive ? {} : { isActive: true };
    const services = await Service.find(filter).sort({ name: 1 });
    return successResponse(res, 200, "Consultation types fetched", services);
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    return successResponse(res, 200, "Consultation type updated", service);
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    return successResponse(res, 200, "Consultation type deactivated", service);
  } catch (error) {
    next(error);
  }
};
