import Appointment from "../models/Appointment.js";

/** Returns the next queue token number for the given calendar day (local server time). */
export const getNextDailyToken = async (slotTime: Date) => {
  const start = new Date(slotTime);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const count = await Appointment.countDocuments({
    slotTime: { $gte: start, $lt: end },
    status: { $ne: "cancelled" }
  });

  return count + 1;
};
