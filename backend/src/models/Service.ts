import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 80
    },
    description: {
      type: String,
      trim: true
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 30,
      min: 5,
      max: 480
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
