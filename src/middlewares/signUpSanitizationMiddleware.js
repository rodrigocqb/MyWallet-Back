import { stripHtml } from "string-strip-html";

function signUpSanitization(req, res, next) {
  let { name, email, password } = req.body;
  name = stripHtml(name).result.trim();
  email = email.trim();
  res.locals.user = { name, email, password };
  next();
}

export default signUpSanitization;
