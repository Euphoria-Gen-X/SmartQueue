import express from "express";
import { body, param, query } from "express-validator";
import {
  cancelAppointment,
  createAppointment,
  getAvailableSlots,
  getAppointmentById,
  getMyAppointments,
  updateMyAppointment
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    authorizeRoles("customer"),
    [
      body("serviceId").isMongoId().withMessage("Valid service id is required"),
      body("slotTime").isISO8601().withMessage("Valid slot time is required"),
      body("preferredTime").optional().trim()
    ],
    validateRequest,
    createAppointment
  )
  .get(protect, authorizeRoles("customer"), getMyAppointments);

router.get(
  "/availability",
  protect,
  authorizeRoles("customer"),
  [
    query("serviceId").isMongoId().withMessage("Valid service id is required"),
    query("date").isISO8601().withMessage("Valid date is required")
  ],
  validateRequest,
  getAvailableSlots
);

router.get(
  "/:id",
  protect,
  authorizeRoles("customer"),
  param("id").isMongoId().withMessage("Invalid appointment id"),
  validateRequest,
  getAppointmentById
);

router.patch(
  "/:id",
  protect,
  authorizeRoles("customer"),
  [
    param("id").isMongoId().withMessage("Invalid appointment id"),
    body("serviceId").optional().isMongoId().withMessage("Valid service id is required"),
    body("slotTime").optional().isISO8601().withMessage("Valid slot time is required"),
    body("preferredTime").optional().trim()
  ],
  validateRequest,
  updateMyAppointment
);

router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("customer"),
  param("id").isMongoId().withMessage("Invalid appointment id"),
  validateRequest,
  cancelAppointment
);

export default router;
