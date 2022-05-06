import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { v4 as uuid } from "uuid";
import joi from "joi";

dotenv.config();
const app = express();
const port = process.env.PORT;
const token = uuid();
app.use(cors());
app.use(json());

app.listen(port, () => {
  console.log(chalk.bold.green(`Server is running on: ${port}`));
});

let database = null;
const mongoclient = new MongoClient(process.env.MONGO_URL);
const promise = mongoclient.connect();
promise.then(() => {
  database = mongoclient.db(process.env.DATABASE);
  console.log(chalk.bold.green("Connected to database"));
});
promise.catch((e) =>
  console.log(chalk.bold.red("Error to connected to database", e))
);

app.post("/login", async (req, res) => {
  const user = req.body;
  const loginschema = joi.object({
    email: joi.string().pattern(/@/).required(),
    password: joi.required(),
  });
  const { error } = loginschema.validate(req.body);
  if (error) {
    chalk.bold.red(console.log(error));
    res.sendStatus(422);
    return;
  }
  try {
    const registeredUser = await database.collection("users").findOne({
      email: user.email,
      password: user.password,
    });
    if (registeredUser) {
      return res.sendStatus(201);    
    }
  } catch (e) {
    chalk.bold.red(console.log(e));
    return res.status(500).send("Usuário não encontrado");
  }
});

app.post("/cadastro", async (req, res) => {
  const user = req.body;
  const registerschema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().pattern(/@/).required(),
    password: joi.required(),
  });
  const { error } = registerschema.validate(req.body);
  if (error) {
    chalk.bold.red(console.log(error));
    res.sendStatus(422);
    return;
  }
  try {
    const registeredUser = await database.collection("users").findOne({
      email: user.email,
      password: user.password,
    });
    if (registeredUser) {
      return res.sendStatus(409);
    }
    await database.collection("users").insertOne({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    res.sendStatus(201);
  } catch (e) {
    chalk.bold.red(console.log(e));
    return res.status(500).send("Usuário não encontrado");
  }
});