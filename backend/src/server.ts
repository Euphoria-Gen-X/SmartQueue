import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { env, validateEnv } from "./config/env.js";
import customerAuthRoutes from "./routes/customerAuthRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import customerAppointmentRoutes from "./routes/customerAppointmentRoutes.js";
import adminAppointmentRoutes from "./routes/adminAppointmentRoutes.js";
import customerQueueRoutes from "./routes/customerQueueRoutes.js";
import adminQueueRoutes from "./routes/adminQueueRoutes.js";
import customerServiceRoutes from "./routes/customerServiceRoutes.js";
import adminServiceRoutes from "./routes/adminServiceRoutes.js";
import customerNotificationRoutes from "./routes/customerNotificationRoutes.js";
import adminNotificationRoutes from "./routes/adminNotificationRoutes.js";
import customerQrRoutes from "./routes/customerQrRoutes.js";
import adminQrRoutes from "./routes/adminQrRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

validateEnv();

const app = express();
const port = env.port;

await connectDB();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (_req, res) => {
  res.json({ success: true, message: "SmartQueue API is running", data: null });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "API healthy",
    data: { status: "ok", timestamp: new Date().toISOString() }
  });
});

// Customer API
app.use("/api/customer/auth", customerAuthRoutes);
app.use("/api/customer/appointments", customerAppointmentRoutes);
app.use("/api/customer/queue", customerQueueRoutes);
app.use("/api/customer/services", customerServiceRoutes);
app.use("/api/customer/notifications", customerNotificationRoutes);
app.use("/api/customer/qr", customerQrRoutes);

// Admin API
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/appointments", adminAppointmentRoutes);
app.use("/api/admin/queue", adminQueueRoutes);
app.use("/api/admin/services", adminServiceRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);
app.use("/api/admin/qr", adminQrRoutes);

// Admin analytics/dashboard
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`SmartQueue API listening on port ${port}`);
});
