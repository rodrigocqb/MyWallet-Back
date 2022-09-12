import express from "express";
import cors from "cors";
import { login, registerUser } from "./controllers/auth.controller";
import {
  createTransaction,
  getUserTransactions,
} from "./controllers/transaction.controller";

const app = express();
app.use(express.json());
app.use(cors());

async function isUserRegistered(email) {
  const exists = db.collection("users").findOne({ email });
  return exists;
}

app.post("/sign-up", registerUser);

app.post("/sign-in", login);

app.post("/transactions", createTransaction);

app.get("/transactions", getUserTransactions);

app.listen(5000, () => console.log("Server listening on port 5000!"));
