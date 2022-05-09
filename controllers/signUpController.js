import { MongoClient } from "mongodb";
import joi from "joi";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

import database from "../database.js";
import registerschema from "./../schemas"

export async function postSignUp(req, res) {
  const { name, email, password, confirmation } = req.body;
  const xx = { name, email, password, confirmation };
  const { error } = registerschema.validate(xx, { abortEarly: false });
  const cryptPassword = bcrypt.hashSync(password, 10);
  if (error) {
    chalk.bold.red(console.log(error));
    res.status(409).send(
      validate.error.details.map((e) => {
        return e.message;
      })
    );
    return;
  }
  const user = { name, email, password: cryptPassword };

  try {
    const registeredUser = await database
      .collection("users")
      .findOne({ email });
    if (registeredUser) {
      return res.status(400).send("E-mail já cadastrado. Escolha outro!");
    }
    await database
    .collection("users")
    .insertOne(user);
    res.sendStatus(200);
  } catch (e) {
    chalk.bold.red(console.log(e));
    res.status(409).send(e);
  }
}
