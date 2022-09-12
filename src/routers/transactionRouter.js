import express from "express";
import {
  createTransaction,
  getUserTransactions,
} from "../controllers/transactionController.js";
import checkToken from "../middlewares/checkTokenMiddleware.js";
import transactionSanitization from "../middlewares/transactionSanitizationMiddleware.js";
import transactionSchemaValidation from "../middlewares/transactionSchemaValidationMiddleware.js";

const router = express.Router();

router.use(checkToken);

router.get("/transactions", getUserTransactions);

router.use(transactionSanitization);
router.use(transactionSchemaValidation);

router.post("/transactions", createTransaction);

export default router;
