import type { NextFunction, Request, Response } from "express";
import Appointment from "../models/Appointment.js";
import Queue from "../models/Queue.js";
import { successResponse } from "../utils/apiResponse.js";
import { checkInAppointment, recalculateQueuePositions } from "../services/queueService.js";
import { getAppointmentDateKey } from "../utils/generateAppointmentCode.js";

export const getQueue = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const filter =
      _req.user?.role === "customer"
        ? { userId: _req.user._id }
        : {
            appointmentDateKey: getAppointmentDateKey(new Date()),
            status: { $in: ["waiting", "serving"] }
          };
    const queue = await Queue.find(filter)
      .populate({
        path: "appointmentId",
        populate: [
          { path: "userId", select: "name email phone" },
          { path: "serviceId", select: "name durationMinutes" }
        ]
      })
      .sort({ currentPosition: 1 });
    return successResponse(res, 200, "Queue fetched", queue);
  } catch (error) {
    next(error);
  }
};

export const getQueueStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queueItem = await Queue.findOne({ appointmentId: req.params.appointmentId })
      .populate({
        path: "appointmentId",
        populate: { path: "serviceId", select: "name durationMinutes" }
      });

    if (!queueItem) {
      res.status(404);
      throw new Error("Queue token not found");
    }

    const ownsQueueItem = queueItem.userId?.equals(req.user?._id);
    const canManage = ["admin", "staff"].includes(req.user?.role || "");
    if (!ownsQueueItem && !canManage) {
      res.status(403);
      throw new Error("Forbidden: queue token belongs to another customer");
    }

    return successResponse(res, 200, "Queue status fetched", queueItem);
  } catch (error) {
    next(error);
  }
};

export const checkIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { appointmentId } = req.body;
    const result = await checkInAppointment({
      appointmentId,
      userId: String(req.user?._id),
      role: req.user?.role || "customer",
      method: "manual"
    });

    return successResponse(res, 200, "Check-in successful", result);
  } catch (error) {
    next(error);
  }
};

export const updateQueueStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allowedUpdates = {
      status: req.body.status,
      estimatedWait: req.body.estimatedWait
    };
    Object.keys(allowedUpdates).forEach((key) => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key as keyof typeof allowedUpdates];
      }
    });

    const queueItem = await Queue.findByIdAndUpdate(req.params.id, allowedUpdates, {
      new: true
    });

    if (!queueItem) {
      res.status(404);
      throw new Error("Queue item not found");
    }

    if (req.body.status === "serving") {
      await Appointment.findByIdAndUpdate(queueItem.appointmentId, { status: "in-service" });
    }

    if (req.body.status === "served") {
      await Appointment.findByIdAndUpdate(queueItem.appointmentId, { status: "completed" });
    }

    if (["waiting", "served", "cancelled"].includes(req.body.status)) {
      await recalculateQueuePositions(queueItem.appointmentDateKey);
    }

    return successResponse(res, 200, "Queue updated", queueItem);
  } catch (error) {
    next(error);
  }
};
