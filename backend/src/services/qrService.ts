import Appointment from "../models/Appointment.js";
import Queue from "../models/Queue.js";
import { generateQrCode } from "../utils/qrGenerator.js";
import { checkInAppointment } from "./queueService.js";

export const parseQrPayload = (payload: string | Record<string, unknown>) => {
  if (typeof payload === "object") {
    return payload;
  }

  try {
    return JSON.parse(payload);
  } catch (_error) {
    return { appointmentId: payload };
  }
};

export const buildQrPayload = (appointment: any) => ({
  appointmentId: String(appointment._id),
  appointmentCode: appointment.appointmentCode,
  tokenNumber: appointment.tokenNumber,
  customerId: String(appointment.userId)
});

export const generateAppointmentQr = async (appointment: any) => {
  return generateQrCode(buildQrPayload(appointment));
};

export const validateQrPayload = async (payload: string | Record<string, unknown>) => {
  const parsed = parseQrPayload(payload);
  const appointmentId = parsed.appointmentId as string;
  const tokenNumber = parsed.tokenNumber ? Number(parsed.tokenNumber) : undefined;
  const customerId = parsed.customerId as string | undefined;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    const error = new Error("Invalid QR: appointment not found");
    (error as any).statusCode = 404;
    throw error;
  }

  if (tokenNumber && appointment.tokenNumber !== tokenNumber) {
    const error = new Error("Invalid QR: token mismatch");
    (error as any).statusCode = 400;
    throw error;
  }

  if (customerId && !appointment.userId.equals(customerId)) {
    const error = new Error("Invalid QR: customer mismatch");
    (error as any).statusCode = 400;
    throw error;
  }

  if (["cancelled", "completed"].includes(appointment.status)) {
    const error = new Error("Invalid QR: appointment is not active");
    (error as any).statusCode = 400;
    throw error;
  }

  const queueItem = await Queue.findOne({ appointmentId: appointment._id });

  return { appointment, queueItem, payload: buildQrPayload(appointment) };
};

export const checkInWithQr = async ({
  payload,
  userId,
  role
}: {
  payload: string | Record<string, unknown>;
  userId: string;
  role: string;
}) => {
  const { appointment } = await validateQrPayload(payload);
  return checkInAppointment({
    appointmentId: String(appointment._id),
    userId,
    role,
    method: "qr"
  });
};
