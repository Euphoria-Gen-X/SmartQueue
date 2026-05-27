import express from "express";
import { body } from "express-validator";
import { getMyNotifications, sendNotification } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "staff"), getMyNotifications);

router.post(
  "/",
  protect,
  authorizeRoles("admin", "staff"),
  [
    body("userId").isMongoId().withMessage("Valid user id is required"),
    body("type")
      .isIn(["booking-confirmation", "reminder", "queue-alert"])
      .withMessage("Invalid notification type"),
    body("message").trim().notEmpty().withMessage("Message is required"),
    body("email").optional().isEmail().withMessage("Valid email is required")
  ],
  validateRequest,
  sendNotification
);

export default router;

