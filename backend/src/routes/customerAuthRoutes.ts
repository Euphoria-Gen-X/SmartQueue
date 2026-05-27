import express from "express";
import { body } from "express-validator";
import { getProfile, loginUser, logoutUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimitMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.use(authRateLimiter);

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("phone")
      .trim()
      .isLength({ min: 7, max: 15 })
      .withMessage("Phone number must be between 7 and 15 characters"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validateRequest,
  (req, _res, next) => {
    // Force customer registration (no role escalation from client).
    req.body.role = "customer";
    next();
  },
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validateRequest,
  (req, _res, next) => {
    req.allowedRoles = ["customer"];
    next();
  },
  loginUser
);

router.get("/me", protect, getProfile);
router.post("/logout", protect, logoutUser);

export default router;
