import joi from "joi";
import { stripHtml } from "string-strip-html";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from "../database/db.js";

const signUpSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

async function registerUser(req, res) {
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
}

async function login(req, res) {
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
}

export { registerUser, login };
