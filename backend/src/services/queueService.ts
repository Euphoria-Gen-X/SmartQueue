import Appointment from "../models/Appointment.js";
import CheckInLog from "../models/CheckInLog.js";
import Queue from "../models/Queue.js";
import { getAppointmentDateKey } from "../utils/generateAppointmentCode.js";

export const recalculateQueuePositions = async (appointmentDateKey = getAppointmentDateKey(new Date())) => {
  const waitingItems = await Queue.find({ appointmentDateKey, status: "waiting" }).sort({ updatedAt: 1 });

  await Promise.all(
    waitingItems.map((item, index) => {
      item.currentPosition = index + 1;
      item.estimatedWait = index * 10;
      return item.save();
    })
  );
};

export const checkInAppointment = async ({
  appointmentId,
  userId,
  role,
  method = "qr"
}: {
  appointmentId: string;
  userId: string;
  role: string;
  method?: "qr" | "manual";
}) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    const error = new Error("Appointment not found");
    (error as any).statusCode = 404;
    throw error;
  }

  const isOwner = appointment.userId.equals(userId);
  const canManage = ["admin", "staff"].includes(role);

  if (!isOwner && !canManage) {
    const error = new Error("Forbidden: appointment belongs to another user");
    (error as any).statusCode = 403;
    throw error;
  }

  if (appointment.status === "cancelled" || appointment.status === "completed") {
    const error = new Error("Appointment cannot be checked in");
    (error as any).statusCode = 400;
    throw error;
  }

  if ((appointment.appointmentDateKey || getAppointmentDateKey(appointment.slotTime)) !== getAppointmentDateKey(new Date())) {
    const error = new Error("Check-in is only available on the scheduled appointment date");
    (error as any).statusCode = 400;
    throw error;
  }

  if (appointment.status === "checked-in") {
    const queueItem = await Queue.findOne({ appointmentId: appointment._id });
    return { appointment, queueItem, alreadyCheckedIn: true };
  }

  appointment.status = "checked-in";
  appointment.checkedInAt = new Date();
  await appointment.save();

  const queueItem = await Queue.findOneAndUpdate(
    { appointmentId: appointment._id },
    { status: "waiting", userId: appointment.userId, tokenNumber: appointment.tokenNumber },
    { new: true }
  );

  await recalculateQueuePositions(appointment.appointmentDateKey);

  await CheckInLog.create({
    appointmentId: appointment._id,
    userId: appointment.userId,
    tokenNumber: appointment.tokenNumber,
    method,
    isValid: true
  });

  return { appointment, queueItem };
};
