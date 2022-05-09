import { MongoClient } from "mongodb";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

import database from "../database.js";

export async function postSignIn(req, res) {
  const { email, password } = req.body;
  try {
    const registeredUser = await database
      .collection("users")
      .findOne({ email });
    if (!registeredUser) {
      return res.status(409).send("Usuário não encontrado");
    }
    const returnPassword = bcrypt.compareSync(
      password,
      registeredUser.password
    );
    if (!returnPassword) {
      return res.status(401).send("E-mail ou senha inválidos");
    }
    const token = uuid();
    await database
     .collection("sessions")
     .insertOne({
      token,
      userId: registeredUser._id,
    });

    res.status(200).send({ token, user: registeredUser.name });
  } catch (e) {
    chalk.bold.red(console.log(e));
    res.status(409).send(e);
  }
}
