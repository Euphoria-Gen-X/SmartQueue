import express from "express";
import { getServices } from "../controllers/serviceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("customer"), getServices);

export default router;

