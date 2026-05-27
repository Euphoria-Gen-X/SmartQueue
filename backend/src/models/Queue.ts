import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tokenNumber: {
      type: Number,
      required: true,
      min: 1
    },
    appointmentDateKey: {
      type: String,
      required: true,
      trim: true
    },
    currentPosition: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    estimatedWait: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["booked", "waiting", "serving", "served", "cancelled"],
      default: "booked"
    }
  },
  { timestamps: true }
);

queueSchema.index({ appointmentDateKey: 1, status: 1, currentPosition: 1 });

const Queue = mongoose.model("Queue", queueSchema);

export default Queue;
