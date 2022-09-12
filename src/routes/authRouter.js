import express from "express";
import { registerUser, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/sign-up", registerUser);
router.post("/sign-in", login);

export default router;
