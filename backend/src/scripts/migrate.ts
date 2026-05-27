import connectDB from "../config/db.js";
import Appointment from "../models/Appointment.js";
import Queue from "../models/Queue.js";
import { getAppointmentDateKey } from "../utils/generateAppointmentCode.js";

const migrate = async () => {
  await connectDB();

  const appointments = await Appointment.find().select("_id userId tokenNumber slotTime status");
  for (const appointment of appointments) {
    const appointmentDateKey = getAppointmentDateKey(appointment.slotTime);
    await Appointment.updateOne(
      { _id: appointment._id },
      { $set: { appointmentDateKey } }
    );

    const queueStatus =
      appointment.status === "booked"
        ? "booked"
        : appointment.status === "in-service"
          ? "serving"
          : appointment.status === "completed"
            ? "served"
            : appointment.status === "cancelled"
              ? "cancelled"
              : "waiting";
    const positionUpdate =
      queueStatus === "booked" ? { currentPosition: 0, estimatedWait: 0 } : {};

    await Queue.updateOne(
      { appointmentId: appointment._id },
      {
        $set: {
          userId: appointment.userId,
          tokenNumber: appointment.tokenNumber,
          appointmentDateKey,
          status: queueStatus,
          ...positionUpdate
        }
      }
    );
  }

  const dayKeys = [...new Set(appointments.map((appointment) => getAppointmentDateKey(appointment.slotTime)))];
  for (const dayKey of dayKeys) {
    const waiting = await Queue.find({ appointmentDateKey: dayKey, status: "waiting" }).sort({ updatedAt: 1 });
    await Promise.all(
      waiting.map((queueItem, index) =>
        Queue.updateOne(
          { _id: queueItem._id },
          { $set: { currentPosition: index + 1, estimatedWait: index * 10 } }
        )
      )
    );
  }

  const indexes = await Appointment.collection.indexes();
  const oldSlotIndex = indexes.find(
    (index) => index.name === "slotTime_1_serviceId_1" || index.name === "serviceId_1_slotTime_1"
  );

  if (oldSlotIndex && !oldSlotIndex.unique) {
    await Appointment.collection.dropIndex(oldSlotIndex.name);
  }

  await Appointment.syncIndexes();
  console.log("Migration complete: queue states and appointment indexes synchronized");
  process.exit(0);
};

migrate().catch((error) => {
  console.error(`Migration failed: ${error.message}`);
  process.exit(1);
});
