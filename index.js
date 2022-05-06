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
    return res.status(500).send("Erro ao cadastrar o usuário");
  }
});

app.get("/registros", async (req, res) => {
  try {
    const records = await database.collection("registros").find().toArray();
    res.send(records);
  } catch (e) {
    console.log(e);
    return res.status(500).send("Erro ao obter os registros!", e);
  }
});

app.post("/novaentrada", async (req, res) => {
  const entry = req.body;
  const entryschema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
  });
  const { error } = entryschema.validate(req.body);
  if (error) {
    chalk.bold.red(console.log(error));
    res.sendStatus(422);
    return;
  }
  try {
    await database.collection("registros").insertOne({
      value: user.value,
      description: user.description,
    });
    res.sendStatus(201);
  } catch (e) {
    chalk.bold.red(console.log(e));
    return res.sendStatus(500);
  }
});

app.post("/novasaida", async (req, res) => {
  const exit = req.body;
  const exitschema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
  });
  const { error } = exitschema.validate(req.body);
  if (error) {
    chalk.bold.red(console.log(error));
    res.sendStatus(422);
    return;
  }
  try {
    await database.collection("registros").insertOne({
      value: user.value,
      description: user.description,
    });
    res.sendStatus(201);
  } catch (e) {
    chalk.bold.red(console.log(e));
    return res.sendStatus(500);
  }
});
