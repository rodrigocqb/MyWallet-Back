import express from "express";
import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  getUserTransactions,
} from "../controllers/transactionController.js";
import checkToken from "../middlewares/checkTokenMiddleware.js";
import transactionSanitization from "../middlewares/transactionSanitizationMiddleware.js";
import transactionSchemaValidation from "../middlewares/transactionSchemaValidationMiddleware.js";

const router = express.Router();

router.use(checkToken);

router.get("/transactions", getUserTransactions);
router.delete("/transactions/:id", deleteTransaction);

router.use(transactionSanitization);
router.use(transactionSchemaValidation);

router.post("/transactions", createTransaction);
router.put("/transactions/:id", editTransaction);

export default router;
