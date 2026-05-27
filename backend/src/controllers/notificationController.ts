import type { NextFunction, Request, Response } from "express";
import Notification from "../models/Notification.js";
import { sendEmail } from "../utils/sendEmail.js";
import { successResponse } from "../utils/apiResponse.js";

export const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await Notification.find({ userId: req.user?._id }).sort({
      createdAt: -1
    });
    return successResponse(res, 200, "Notifications fetched", notifications);
  } catch (error) {
    next(error);
  }
};

export const sendNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, appointmentId, type, message, email, subject } = req.body;
    const notification = await Notification.create({
      userId,
      appointmentId,
      type,
      message,
      status: "pending"
    });

    if (email) {
      const emailResult = await sendEmail({
        to: email,
        subject: subject || "SmartQueue notification",
        text: message
      });
      notification.status = "skipped" in emailResult ? "pending" : "sent";
      await notification.save();
    }

    return successResponse(res, 201, "Notification created", notification);
  } catch (error) {
    next(error);
  }
};
