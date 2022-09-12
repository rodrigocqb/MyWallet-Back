import { signInSchema } from "../schemas/signInSchema.js";

function signInSchemaValidation(req, res, next) {
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
  next();
}

export default signInSchemaValidation;
