import express from "express";
import { body, param } from "express-validator";
import { getQueue, getQueueStatus, updateQueueStatus } from "../controllers/queueController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "staff"), getQueue);
router.get(
  "/status/:appointmentId",
  protect,
  authorizeRoles("admin", "staff"),
  param("appointmentId").isMongoId().withMessage("Valid appointment id is required"),
  validateRequest,
  getQueueStatus
);

router.patch(
  "/:id",
  protect,
  authorizeRoles("admin", "staff"),
  [
    param("id").isMongoId().withMessage("Invalid queue id"),
    body("status")
      .optional()
      .isIn(["booked", "waiting", "serving", "served", "cancelled"])
      .withMessage("Invalid queue status"),
    body("estimatedWait").optional().isNumeric().withMessage("Estimated wait must be a number")
  ],
  validateRequest,
  updateQueueStatus
);

export default router;
