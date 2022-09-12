import { stripHtml } from "string-strip-html";

function transactionSanitization(req, res, next) {
  let { description } = req.body;
  description = stripHtml(description).result.trim();
  res.locals.description = description;
  next();
}

export default transactionSanitization;
