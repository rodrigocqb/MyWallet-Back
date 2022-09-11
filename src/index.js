import express from "express";
import cors from "cors";
import joi from "joi";
import { stripHtml } from "string-strip-html";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from "./database/db";

const app = express();
app.use(express.json());
app.use(cors());

const signUpSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const transactionSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  type: joi.string().valid("receipt", "payment").required(),
});

async function isUserRegistered(email) {
  const exists = db.collection("users").findOne({ email });
  return exists;
}

app.post("/sign-up", async (req, res) => {
  let { name, email, password } = req.body;
  name = stripHtml(name).result.trim();
  email = email.trim();
  const validation = signUpSchema.validate(
    { name, email, password },
    { abortEarly: false }
  );
  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }
  password = bcrypt.hashSync(password, 10);
  try {
    const exists = await isUserRegistered(email);
    if (exists) {
      res.sendStatus(409);
      return;
    }
    await db
      .collection("users")
      .insertOne({ name, email, password, transactions: [] });
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  const validation = signInSchema.validate(
    { email, password },
    { abortEarly: false }
  );
  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }
  try {
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      res.status(404).send({ error: "User not found" });
      return;
    }
    if (!bcrypt.compareSync(password, user.password)) {
      res.sendStatus(401);
      return;
    }
    const token = uuid();
    await db.collection("sessions").insertOne({ userId: user._id, token });
    res.status(200).send({ name: user.name, token });
  } catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.post("/transactions", async (req, res) => {
  let { description } = req.body;
  const { value, type } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  description = stripHtml(description).result.trim();
  const validation = transactionSchema.validate(
    { value, description, type },
    { abortEarly: false }
  );
  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }
  try {
    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      res.sendStatus(401);
    }
    const user = await db.collection("users").findOne({ _id: session.userId });
    await db.collection("users").updateOne(
      { _id: session.userId },
      {
        $set: {
          transactions: [
            ...user.transactions,
            { value, description, type, date: new Date() },
          ],
        },
      }
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.get("/transactions", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  try {
    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      res.sendStatus(401);
      return;
    }
    const user = await db.collection("users").findOne({ _id: session.userId });
    res.send(user.transactions);
  } catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.listen(5000, () => console.log("Server listening on port 5000!"));
