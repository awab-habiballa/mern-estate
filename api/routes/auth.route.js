import express from "express";
import { body } from "express-validator";
import {
  google,
  signin,
  signOut,
  signup,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }).trim(),
  ],
  signup
);
router.post("/signin", body("email").normalizeEmail(), signin);
router.post("/google", google);
router.get("/signout", signOut);

export default router;
