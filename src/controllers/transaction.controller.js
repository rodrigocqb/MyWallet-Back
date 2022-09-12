import joi from "joi";
import { stripHtml } from "string-strip-html";
import db from "../database/db.js";

const transactionSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  type: joi.string().valid("receipt", "payment").required(),
});

async function createTransaction(req, res) {
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
}

async function getUserTransactions(req, res) {
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
}

export { createTransaction, getUserTransactions };
