import express from "express";
import { registerUser, login } from "../controllers/authController.js";
import signInSchemaValidation from "../middlewares/signInSchemaValidationMiddleware.js";
import signUpSanitization from "../middlewares/signUpSanitizationMiddleware.js";
import signUpValidation from "../middlewares/signUpValidationMiddleware.js";

const router = express.Router();

router.post("/sign-up", signUpSanitization, signUpValidation, registerUser);
router.post("/sign-in", signInSchemaValidation, login);

export default router;
