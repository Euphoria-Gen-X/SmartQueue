import express from "express";
import { body } from "express-validator";
import { adminLogin, getProfile, logoutUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimitMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.use(authRateLimiter);

// Admin login uses the same user login for now (DB-seeded admin).
// Env-hardcoded admin credentials can be added later without changing the route shape.
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validateRequest,
  adminLogin
);

router.get("/me", protect, authorizeRoles("admin"), getProfile);
router.post("/logout", protect, authorizeRoles("admin", "staff"), logoutUser);

export default router;
