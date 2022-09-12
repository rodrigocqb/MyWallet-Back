import db from "../database/db.js";

async function createTransaction(req, res) {
  const { value, type } = req.body;
  const description = res.locals.description;
  try {
    const user = res.locals.user;
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          transactions: [
            ...user.transactions,
            {
              id: user.transactions.length + 1,
              value,
              description,
              type,
              date: new Date(),
            },
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
  try {
    const user = res.locals.user;
    res.send(user.transactions);
  } catch (error) {
    res.status(500).send(error);
    return;
  }
}

export { createTransaction, getUserTransactions };
