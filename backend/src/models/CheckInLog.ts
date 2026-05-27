import mongoose from "mongoose";

const checkInLogSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tokenNumber: {
      type: Number,
      required: true
    },
    method: {
      type: String,
      enum: ["qr", "manual"],
      default: "qr"
    },
    isValid: {
      type: Boolean,
      default: true
    },
    checkedInAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

checkInLogSchema.index({ appointmentId: 1, checkedInAt: -1 });

const CheckInLog = mongoose.model("CheckInLog", checkInLogSchema);

export default CheckInLog;
