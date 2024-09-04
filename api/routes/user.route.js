import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../util/verifyUser.js";
import { body } from "express-validator";

const router = express.Router();

router.get("/test", test);
router.post(
  "/update/:id",
  [
    body("email").optional().isEmail().normalizeEmail(),

    body("password").optional().isLength({ min: 6 }).isAlphanumeric().trim(),
  ],
  verifyToken,
  updateUser
);

export default router;
