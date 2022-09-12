import db from "../database/db.js";

function transactionExists(transactions, id) {
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].id === id) {
      return true;
    }
  }
  return false;
}

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
              id: user.transactions[user.transactions.length - 1].id + 1,
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
  const user = res.locals.user;
  res.send(user.transactions);
}

async function deleteTransaction(req, res) {
  const id = Number(req.params.id);
  const user = res.locals.user;
  const exists = transactionExists(user.transactions, id);
  if (!exists) {
    res.sendStatus(404);
    return;
  }
  const newTransactions = user.transactions.filter(
    (transaction) => transaction.id !== id
  );
  try {
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          transactions: newTransactions,
        },
      }
    );
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error);
    return;
  }
}

export { createTransaction, getUserTransactions, deleteTransaction };
