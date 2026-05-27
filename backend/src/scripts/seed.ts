import connectDB from "../config/db.js";
import { env } from "../config/env.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

const ensureUser = async ({
  name,
  email,
  phone,
  password,
  role
}: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "customer" | "admin" | "staff";
}) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (!existingUser) {
    await User.create({
      name,
      email: normalizedEmail,
      phone,
      password,
      role
    });
    console.log(`Created ${role}: ${normalizedEmail}`);
    return;
  }

  existingUser.name = name;
  existingUser.phone = phone;
  existingUser.role = role;

  const passwordMatches = await existingUser.matchPassword(password);
  if (!passwordMatches) {
    existingUser.password = password;
  }

  await existingUser.save();
  console.log(`Updated ${role}: ${normalizedEmail}`);
};

const seed = async () => {
  await connectDB();

  await ensureUser({
    name: "SmartQueue Admin",
    email: env.adminEmail,
    phone: "0000000000",
    password: env.adminPassword,
    role: "admin"
  });

  await ensureUser({
    name: "Demo Customer",
    email: "customer@smartqueue.local",
    phone: "9876543210",
    password: "customer123",
    role: "customer"
  });

  const services = [
    {
      name: "General Consultation",
      description: "Standard consultation for routine health concerns",
      durationMinutes: 30
    },
    {
      name: "Emergency Consultation",
      description: "Urgent same-day consultation",
      durationMinutes: 20
    },
    {
      name: "Specialist Consultation",
      description: "Consultation with a specialist doctor",
      durationMinutes: 45
    },
    {
      name: "Follow-up Consultation",
      description: "Follow-up visit after a previous appointment",
      durationMinutes: 20
    }
  ];

  for (const service of services) {
    await Service.updateOne(
      { name: service.name },
      {
        $set: {
          description: service.description,
          durationMinutes: service.durationMinutes,
          isActive: true
        }
      },
      { upsert: true }
    );
  }

  console.log("Seed complete: admin, demo customer, and 4 consultation types");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
