import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import transactionRouter from "./routes/transactionController.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(transactionRouter);

async function isUserRegistered(email) {
  const exists = db.collection("users").findOne({ email });
  return exists;
}

app.listen(5000, () => console.log("Server listening on port 5000!"));
