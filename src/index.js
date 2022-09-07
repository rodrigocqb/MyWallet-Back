import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import { stripHtml } from "string-strip-html";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => {
  db = mongoClient.db("my_wallet");
});

const signUpSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string.required(),
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
    await db.collection("users").insertOne({ name, email, password });
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
    return;
  }
});

app.listen(5000, () => console.log("Server listening on port 5000!"));
