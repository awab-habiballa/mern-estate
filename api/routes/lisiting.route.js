import express from "express";
import { createListing ,deleteListing } from "../controllers/lisiting.controller.js";
import { verifyToken } from "../util/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id",verifyToken,deleteListing)
export default router;
