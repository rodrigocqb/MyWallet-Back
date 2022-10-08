import express from "express";
import cors from "cors";
import authRouter from "./routers/authRouter.js";
import transactionRouter from "./routers/transactionRouter.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(transactionRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}!`)
);
