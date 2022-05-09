import joi from "joi";

const registerschema = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(1).required(),
  confirmation: joi.ref("password"),
});

export default registerschema;