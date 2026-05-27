import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment"
    },
    type: {
      type: String,
      enum: ["booking-confirmation", "reminder", "queue-alert"],
      required: true
    },
    channel: {
      type: String,
      enum: ["email"],
      default: "email"
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
