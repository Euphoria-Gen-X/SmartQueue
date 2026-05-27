import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    appointmentCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },
    slotTime: {
      type: Date,
      required: true
    },
    preferredTime: {
      type: String,
      trim: true
    },
    appointmentDateKey: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["booked", "checked-in", "in-service", "completed", "cancelled"],
      default: "booked"
    },
    tokenNumber: {
      type: Number,
      required: true,
      min: 1
    },
    qrCodeDataUrl: {
      type: String
    },
    checkedInAt: {
      type: Date
    },
    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

appointmentSchema.index(
  { serviceId: 1, slotTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["booked", "checked-in", "in-service", "completed"] }
    }
  }
);
appointmentSchema.index(
  { appointmentDateKey: 1, tokenNumber: 1 },
  { unique: true, sparse: true }
);
appointmentSchema.index({ userId: 1, createdAt: -1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
