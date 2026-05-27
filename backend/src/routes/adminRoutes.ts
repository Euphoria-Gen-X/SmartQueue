import express from "express";
import {
  getAnalytics,
  getCheckInLogs,
  getDashboardSummary
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("admin", "staff"), getDashboardSummary);
router.get("/analytics", protect, authorizeRoles("admin", "staff"), getAnalytics);
router.get("/check-in-logs", protect, authorizeRoles("admin", "staff"), getCheckInLogs);

export default router;
