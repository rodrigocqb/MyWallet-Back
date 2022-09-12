import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from "../database/db.js";

async function isUserRegistered(email) {
  const exists = db.collection("users").findOne({ email });
  return exists;
}

async function registerUser(req, res) {
  let { password } = res.locals.user;
  const { name, email } = res.locals.user;
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
  try {
    const user = await isUserRegistered(email);
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
