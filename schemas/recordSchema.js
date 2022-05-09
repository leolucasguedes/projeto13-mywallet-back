import joi from "joi";

 const validateschema = joi.object({
    value: joi.number().min(1).required(),
    type: joi.any().valid("entrada", "saida").required(),
    describe: joi.string().min(1).required(),
  });

  export default validateschema;
