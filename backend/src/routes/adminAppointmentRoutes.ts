import express from "express";
import { body, param, query } from "express-validator";
import {
  cancelAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("admin", "staff"),
  [
    query("serviceId").optional().isMongoId().withMessage("Invalid service id"),
    query("status")
      .optional()
      .isIn(["booked", "checked-in", "in-service", "completed", "cancelled"])
      .withMessage("Invalid status"),
    query("date").optional().isISO8601().withMessage("Invalid date"),
    query("search").optional().isString()
  ],
  validateRequest,
  getAllAppointments
);

router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "staff"),
  param("id").isMongoId().withMessage("Invalid appointment id"),
  validateRequest,
  getAppointmentById
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "staff"),
  [
    param("id").isMongoId().withMessage("Invalid appointment id"),
    body("status")
      .isIn(["booked", "checked-in", "in-service", "completed", "cancelled"])
      .withMessage("Invalid status")
  ],
  validateRequest,
  updateAppointmentStatus
);

router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("admin", "staff"),
  param("id").isMongoId().withMessage("Invalid appointment id"),
  validateRequest,
  cancelAppointment
);

export default router;
