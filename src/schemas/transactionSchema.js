import joi from "joi";

const transactionSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  type: joi.string().valid("receipt", "payment").required(),
});

export { transactionSchema };
