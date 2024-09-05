import express from "express";
import {
  deleteUser,
  test,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../util/verifyUser.js";
import { body } from "express-validator";

const router = express.Router();

router.get("/test", test);
router.post(
  "/update/:id",
  [
    body("email").optional().isEmail().normalizeEmail(),

    body("password").optional().isLength({ min: 6 }).trim(),
  ],
  verifyToken,
  updateUser
);

router.delete("/delete/:id", verifyToken, deleteUser);

export default router;
