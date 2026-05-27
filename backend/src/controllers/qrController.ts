import type { Request, Response, NextFunction } from "express";
import { checkInWithQr, generateAppointmentQr, validateQrPayload } from "../services/qrService.js";
import Appointment from "../models/Appointment.js";
import { successResponse } from "../utils/apiResponse.js";

export const generateQr = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointment = await Appointment.findById(req.body.appointmentId);

    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    const ownsAppointment = appointment.userId.equals(req.user?._id);
    const canManage = ["admin", "staff"].includes(req.user?.role || "");
    if (!ownsAppointment && !canManage) {
      res.status(403);
      throw new Error("Forbidden: appointment belongs to another customer");
    }

    appointment.qrCodeDataUrl = await generateAppointmentQr(appointment);
    await appointment.save();

    return successResponse(res, 200, "QR generated successfully", {
      qrCodeDataUrl: appointment.qrCodeDataUrl
    });
  } catch (error) {
    next(error);
  }
};

export const validateQr = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await validateQrPayload(req.body.payload || req.body);
    const ownsAppointment = result.appointment.userId.equals(req.user?._id);
    const canManage = ["admin", "staff"].includes(req.user?.role || "");
    if (!ownsAppointment && !canManage) {
      res.status(403);
      throw new Error("Forbidden: appointment belongs to another customer");
    }

    return successResponse(res, 200, "QR is valid", result);
  } catch (error) {
    next(error);
  }
};

export const checkInQr = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await checkInWithQr({
      payload: req.body.payload || req.body,
      userId: String(req.user?._id),
      role: req.user?.role || "customer"
    });

    const message = result.alreadyCheckedIn ? "Already checked in" : "QR check-in successful";
    return successResponse(res, 200, message, result);
  } catch (error) {
    next(error);
  }
};
