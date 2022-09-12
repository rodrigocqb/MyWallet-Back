import db from "../database/db.js";

async function checkToken(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  try {
    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      res.sendStatus(401);
      return;
    }
    const user = await db.collection("users").findOne({ _id: session.userId });
    if (!user) {
      res.sendStatus(401);
      return;
    }
    res.locals.user = user;
    next();
  } catch (error) {
    res.status(500).send(error);
    return;
  }
}

export default checkToken;
