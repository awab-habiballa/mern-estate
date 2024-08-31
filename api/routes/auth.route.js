import express from "express";
import { body } from "express-validator";
import { signin, signup } from "../controllers/auth.controller.js";
const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }).isAlphanumeric().trim(),
  ],
  signup
);
router.post("/signin", body("email").normalizeEmail(), signin);

export default router;
