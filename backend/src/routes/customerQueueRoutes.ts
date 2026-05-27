import express from "express";
import { body, param } from "express-validator";
import { checkIn, getQueue, getQueueStatus } from "../controllers/queueController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("customer"), getQueue);
router.get(
  "/status/:appointmentId",
  protect,
  authorizeRoles("customer"),
  param("appointmentId").isMongoId().withMessage("Valid appointment id is required"),
  validateRequest,
  getQueueStatus
);

router.post(
  "/check-in",
  protect,
  authorizeRoles("customer"),
  body("appointmentId").isMongoId().withMessage("Valid appointment id is required"),
  validateRequest,
  checkIn
);

export default router;
