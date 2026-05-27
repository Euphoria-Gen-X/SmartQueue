import type { NextFunction, Request, Response } from "express";
import Appointment from "../models/Appointment.js";
import Queue from "../models/Queue.js";
import Notification from "../models/Notification.js";
import Service from "../models/Service.js";
import { sendEmail } from "../utils/sendEmail.js";
import { successResponse } from "../utils/apiResponse.js";
import { generateAppointmentCode, getAppointmentDateKey } from "../utils/generateAppointmentCode.js";
import { getNextDailyToken } from "../utils/getNextDailyToken.js";
import { generateAppointmentQr } from "../services/qrService.js";
import { recalculateQueuePositions } from "../services/queueService.js";

const getDayRange = (date: string) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};

export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceId, slotTime, preferredTime } = req.body;
    const appointmentTime = new Date(slotTime);
    const service = await Service.findOne({ _id: serviceId, isActive: true });

    if (!service) {
      res.status(404);
      throw new Error("Active service not found");
    }

    if (Number.isNaN(appointmentTime.getTime()) || appointmentTime < new Date()) {
      res.status(400);
      throw new Error("Slot time must be a valid future date");
    }

    const bookedSlot = await Appointment.findOne({
      serviceId,
      slotTime: appointmentTime,
      status: { $ne: "cancelled" }
    });

    if (bookedSlot) {
      res.status(409);
      throw new Error("Selected slot is already booked");
    }

    const tokenNumber = await getNextDailyToken(appointmentTime);
    const appointmentCode = generateAppointmentCode(tokenNumber, appointmentTime);
    const appointment = await Appointment.create({
      userId: req.user?._id,
      appointmentCode,
      serviceId,
      slotTime: appointmentTime,
      preferredTime,
      appointmentDateKey: getAppointmentDateKey(appointmentTime),
      tokenNumber
    });

    appointment.qrCodeDataUrl = await generateAppointmentQr(appointment);
    await appointment.save();

    await Queue.create({
      appointmentId: appointment._id,
      userId: req.user?._id,
      tokenNumber,
      appointmentDateKey: getAppointmentDateKey(appointmentTime),
      currentPosition: 0,
      estimatedWait: 0,
      status: "booked"
    });

    const slotLabel = appointmentTime.toLocaleString();
    const message = `Your ${service.name} appointment is confirmed for ${slotLabel}. Token number: ${tokenNumber}. Appointment ID: ${appointmentCode}.`;
    const notification = await Notification.create({
      userId: req.user?._id,
      appointmentId: appointment._id,
      type: "booking-confirmation",
      message,
      status: "pending"
    });

    const qrImg = appointment.qrCodeDataUrl
      ? `<p><img src="${appointment.qrCodeDataUrl}" alt="Check-in QR" width="200" height="200" /></p>`
      : "";

    const emailResult = await sendEmail({
      to: req.user?.email || "",
      subject: "SmartQueue appointment confirmation",
      text: message,
      html: `
        <h2>Appointment Confirmed</h2>
        <p><strong>Consultation:</strong> ${service.name}</p>
        <p><strong>Slot:</strong> ${slotLabel}</p>
        <p><strong>Appointment ID:</strong> ${appointmentCode}</p>
        <p><strong>Token Number:</strong> ${tokenNumber}</p>
        ${qrImg}
        <p>Present this QR code at check-in.</p>
      `
    });
    if (!("skipped" in emailResult)) {
      notification.status = "sent";
      await notification.save();
    }

    const populatedAppointment = await appointment.populate("serviceId", "name durationMinutes");
    return successResponse(res, 201, "Appointment booked successfully", populatedAppointment);
  } catch (error) {
    next(error);
  }
};

export const getMyAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointments = await Appointment.find({ userId: req.user?._id }).sort({
      slotTime: -1
    }).populate("serviceId", "name durationMinutes");
    return successResponse(res, 200, "Appointments fetched", appointments);
  } catch (error) {
    next(error);
  }
};

export const getAllAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceId, status, date, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (serviceId) filter.serviceId = serviceId;
    if (status) filter.status = status;
    if (date) {
      const { start, end } = getDayRange(String(date));
      filter.slotTime = { $gte: start, $lt: end };
    }

    let query = Appointment.find(filter)
      .populate("userId", "name email phone")
      .populate("serviceId", "name durationMinutes")
      .sort({ slotTime: 1 });

    const appointments = await query;
    const searched = search
      ? appointments.filter((appointment: any) => {
          const value = `${appointment.appointmentCode} ${appointment.userId?.name} ${appointment.userId?.email}`.toLowerCase();
          return value.includes(String(search).toLowerCase());
        })
      : appointments;

    return successResponse(res, 200, "Appointments fetched", searched);
  } catch (error) {
    next(error);
  }
};

export const getAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("serviceId", "name durationMinutes");

    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    const isOwner = appointment.userId._id.equals(req.user?._id);
    const canManage = ["admin", "staff"].includes(req.user?.role || "");

    if (!isOwner && !canManage) {
      res.status(403);
      throw new Error("Forbidden: appointment belongs to another user");
    }

    return successResponse(res, 200, "Appointment fetched", appointment);
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    const isOwner = appointment.userId.equals(req.user?._id);
    const canManage = ["admin", "staff"].includes(req.user?.role || "");

    if (!isOwner && !canManage) {
      res.status(403);
      throw new Error("Forbidden: appointment belongs to another user");
    }

    appointment.status = "cancelled";
    await appointment.save();
    await Queue.findOneAndUpdate(
      { appointmentId: appointment._id },
      { status: "cancelled", estimatedWait: 0 }
    );
    await recalculateQueuePositions(
      appointment.appointmentDateKey || getAppointmentDateKey(appointment.slotTime)
    );

    return successResponse(res, 200, "Appointment cancelled", appointment);
  } catch (error) {
    next(error);
  }
};

export const updateMyAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    if (!appointment.userId.equals(req.user?._id)) {
      res.status(403);
      throw new Error("Forbidden: appointment belongs to another user");
    }

    if (appointment.status !== "booked") {
      res.status(400);
      throw new Error("Only booked appointments can be rescheduled");
    }

    const serviceId = req.body.serviceId || appointment.serviceId;
    const slotTime = req.body.slotTime ? new Date(req.body.slotTime) : appointment.slotTime;
    const service = await Service.findOne({ _id: serviceId, isActive: true });

    if (!service) {
      res.status(404);
      throw new Error("Active consultation type not found");
    }

    if (Number.isNaN(slotTime.getTime()) || slotTime < new Date()) {
      res.status(400);
      throw new Error("Slot time must be a valid future date");
    }

    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      serviceId,
      slotTime,
      status: { $ne: "cancelled" }
    });

    if (conflict) {
      res.status(409);
      throw new Error("Selected slot is already booked");
    }

    const originalDateKey = appointment.appointmentDateKey || getAppointmentDateKey(appointment.slotTime);
    const nextDateKey = getAppointmentDateKey(slotTime);
    appointment.serviceId = serviceId;
    appointment.slotTime = slotTime;
    appointment.preferredTime = req.body.preferredTime ?? appointment.preferredTime;
    appointment.appointmentDateKey = nextDateKey;

    if (originalDateKey !== nextDateKey) {
      appointment.tokenNumber = await getNextDailyToken(slotTime);
      appointment.appointmentCode = generateAppointmentCode(appointment.tokenNumber, slotTime);
      appointment.qrCodeDataUrl = await generateAppointmentQr(appointment);
    }

    await appointment.save();
    if (originalDateKey !== nextDateKey) {
      await Queue.findOneAndUpdate(
        { appointmentId: appointment._id },
        { tokenNumber: appointment.tokenNumber, appointmentDateKey: nextDateKey }
      );
    }

    return successResponse(res, 200, "Appointment updated", appointment);
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const allowed = ["booked", "checked-in", "in-service", "completed", "cancelled"];

    if (!allowed.includes(status)) {
      res.status(400);
      throw new Error("Invalid appointment status");
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    appointment.status = status;
    if (status === "completed") {
      appointment.completedAt = new Date();
    }
    await appointment.save();

    const queueItem = await Queue.findOne({ appointmentId: appointment._id });
    if (queueItem) {
      if (status === "in-service") {
        queueItem.status = "serving";
      } else if (status === "completed") {
        queueItem.status = "served";
      } else if (status === "cancelled") {
        queueItem.status = "cancelled";
      }
      await queueItem.save();
      if (["completed", "cancelled"].includes(status)) {
        await recalculateQueuePositions(
          appointment.appointmentDateKey || getAppointmentDateKey(appointment.slotTime)
        );
      }
    }

    return successResponse(res, 200, "Appointment status updated", appointment);
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceId, date } = req.query;
    const service = await Service.findOne({ _id: serviceId, isActive: true });

    if (!service) {
      res.status(404);
      throw new Error("Active service not found");
    }

    const { start, end } = getDayRange(String(date));
    const bookedAppointments = await Appointment.find({
      serviceId,
      slotTime: { $gte: start, $lt: end },
      status: { $ne: "cancelled" }
    }).select("slotTime");

    const bookedTimes = new Set(
      bookedAppointments.map((appointment) => appointment.slotTime.toISOString())
    );
    const slots = [];
    const cursor = new Date(start);
    cursor.setHours(9, 0, 0, 0);
    const close = new Date(start);
    close.setHours(17, 0, 0, 0);

    while (cursor < close) {
      const iso = cursor.toISOString();
      slots.push({
        slotTime: iso,
        available: cursor > new Date() && !bookedTimes.has(iso)
      });
      cursor.setMinutes(cursor.getMinutes() + service.durationMinutes);
    }

    return successResponse(res, 200, "Available slots fetched", slots);
  } catch (error) {
    next(error);
  }
};
