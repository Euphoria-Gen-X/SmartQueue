import express from "express";
import { body } from "express-validator";
import { checkInQr, generateQr, validateQr } from "../controllers/qrController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/generate",
  protect,
  authorizeRoles("admin", "staff"),
  body("appointmentId").isMongoId().withMessage("Valid appointment id is required"),
  validateRequest,
  generateQr
);

router.post(
  "/validate",
  protect,
  authorizeRoles("admin", "staff"),
  body("payload").notEmpty().withMessage("QR payload is required"),
  validateRequest,
  validateQr
);
router.post(
  "/check-in",
  protect,
  authorizeRoles("admin", "staff"),
  body("payload").notEmpty().withMessage("QR payload is required"),
  validateRequest,
  checkInQr
);

export default router;
