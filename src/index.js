import express from "express";
import cors from "cors";
import authRouter from "./routers/authRouter.js";
import transactionRouter from "./routers/transactionRouter.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(transactionRouter);

app.listen(5000, () => console.log("Server listening on port 5000!"));
