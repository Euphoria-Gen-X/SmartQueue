import dotenv from "dotenv";

dotenv.config();

const requiredInProduction = ["MONGO_URI", "JWT_SECRET"] as const;

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/SmartQueue",
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  adminEmail: process.env.ADMIN_EMAIL || "admin@smartqueue.local",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  sendgridApiKey: process.env.SENDGRID_API_KEY || "",
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || ""
};

export const validateEnv = () => {
  if (env.nodeEnv !== "production") {
    return;
  }

  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (env.jwtSecret === "development-secret") {
    throw new Error("JWT_SECRET must be set in production");
  }

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in production");
  }
};
