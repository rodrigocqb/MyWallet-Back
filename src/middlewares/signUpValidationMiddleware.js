import { signUpSchema } from "../schemas/signUpSchema.js";

function signUpValidation(req, res, next) {
  const { name, email, password } = res.locals.user;
  const validation = signUpSchema.validate(
    { name, email, password },
    { abortEarly: false }
  );
  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }
  next();
}

export default signUpValidation;
