export const registerschema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(1).required(),
    confirmation: joi.ref("password"),
  });

  export const validateschema = joi.object({
    value: joi.number().min(1).required(),
    type: joi.any().valid("entrada", "saida").required(),
    describe: joi.string().min(1).required(),
  });
