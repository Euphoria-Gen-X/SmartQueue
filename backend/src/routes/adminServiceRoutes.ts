import express from "express";
import { body, param } from "express-validator";
import {
  createService,
  deleteService,
  getServices,
  updateService
} from "../controllers/serviceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const serviceRules = [
  body("name").trim().notEmpty().withMessage("Service name is required"),
  body("durationMinutes")
    .optional()
    .isInt({ min: 5, max: 480 })
    .withMessage("Duration must be between 5 and 480 minutes")
];

router.get("/", protect, authorizeRoles("admin", "staff"), getServices);
router.post("/", protect, authorizeRoles("admin"), serviceRules, validateRequest, createService);
router.patch(
  "/:id",
  protect,
  authorizeRoles("admin"),
  param("id").isMongoId().withMessage("Invalid service id"),
  serviceRules,
  validateRequest,
  updateService
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  param("id").isMongoId().withMessage("Invalid service id"),
  validateRequest,
  deleteService
);

export default router;

