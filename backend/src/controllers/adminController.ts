import type { NextFunction, Request, Response } from "express";
import Appointment from "../models/Appointment.js";
import CheckInLog from "../models/CheckInLog.js";
import Queue from "../models/Queue.js";
import User from "../models/User.js";
import { successResponse } from "../utils/apiResponse.js";
import { getAppointmentDateKey } from "../utils/generateAppointmentCode.js";

export const getDashboardSummary = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const today = getAppointmentDateKey(new Date());
    const [users, appointments, waitingQueue, checkedIn, completed, currentToken, nextToken] =
      await Promise.all([
      User.countDocuments(),
      Appointment.countDocuments(),
      Queue.countDocuments({ appointmentDateKey: today, status: "waiting" }),
      Appointment.countDocuments({ appointmentDateKey: today, status: "checked-in" }),
      Appointment.countDocuments({ appointmentDateKey: today, status: "completed" }),
      Queue.findOne({ appointmentDateKey: today, status: "serving" }).sort({ updatedAt: -1 }),
      Queue.findOne({ appointmentDateKey: today, status: "waiting" }).sort({ currentPosition: 1 })
    ]);

    return successResponse(res, 200, "Dashboard summary fetched", {
      users,
      appointments,
      waitingQueue,
      pendingCustomers: waitingQueue,
      checkedInCustomers: checkedIn,
      completedConsultations: completed,
      currentToken: currentToken?.tokenNumber || null,
      nextToken: nextToken?.tokenNumber || null,
      activeRooms: currentToken ? 1 : 0
    });
  } catch (error) {
    next(error);
  }
};

export const getCheckInLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const logs = await CheckInLog.find()
      .populate("userId", "name email phone")
      .populate({
        path: "appointmentId",
        populate: { path: "serviceId", select: "name" }
      })
      .sort({ checkedInAt: -1 })
      .limit(limit);

    return successResponse(res, 200, "Check-in logs fetched", logs);
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const statusBreakdown = await Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const upcomingAppointments = await Appointment.find({
      slotTime: { $gte: new Date() },
      status: { $nin: ["cancelled", "completed"] }
    })
      .populate("userId", "name email")
      .populate("serviceId", "name")
      .sort({ slotTime: 1 })
      .limit(10);

    return successResponse(res, 200, "Analytics fetched", { statusBreakdown, upcomingAppointments });
  } catch (error) {
    next(error);
  }
};
