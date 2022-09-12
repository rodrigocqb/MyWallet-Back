import db from "../database/db.js";

function transactionExists(transactions, id) {
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].id === id) {
      return true;
    }
  }
  return false;
}

function findTransactionData(transaction, id) {
  for (let i = 0; i < transaction.length; i++) {
    if (transaction[i].id === id) {
      const data = { i, date: transaction[i].date };
      return data;
    }
  }
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
              id:
                user.transactions.length !== 0
                  ? user.transactions[user.transactions.length - 1].id + 1
                  : 1,
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
    console.log(error);
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

async function editTransaction(req, res) {
  const id = Number(req.params.id);
  const user = res.locals.user;
  const exists = transactionExists(user.transactions, id);
  if (!exists) {
    res.sendStatus(404);
    return;
  }
  const { i, date } = findTransactionData(user.transactions, id);
  const { value, type } = req.body;
  const description = res.locals.description;
  const newTransactions = [...user.transactions];
  newTransactions[i] = {
    id,
    value,
    description,
    type,
    date,
  };
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

export {
  createTransaction,
  getUserTransactions,
  deleteTransaction,
  editTransaction,
};
