import { transactionSchema } from "../schemas/transactionSchema.js";

function transactionSchemaValidation(req, res, next) {
  const { value, type } = req.body;
  const description = res.locals.description;
  const validation = transactionSchema.validate(
    { value, description, type },
    { abortEarly: false }
  );
  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }
  next();
}

export default transactionSchemaValidation;
