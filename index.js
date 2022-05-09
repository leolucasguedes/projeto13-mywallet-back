import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { v4 as uuid} from "uuid";
import joi from "joi";
import dayjs from "dayjs";
import "dayjs/locale/pt-br.js";

import database from "./database.js";
import { postSignUp } from "./controllers/signUpController.js";
import { postSignIn } from "./controllers/signInController.js";
import validateschema from "./schemas"

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(json());

app.listen(port, () => {
  console.log(chalk.bold.green(`Server is running on: ${port}`));
});

app.post("/signup", postSignUp);

app.post("/", postSignIn);

app.post("/myrecords", async (req, res) => {
  const { authorization } = req.headers;
  const { value, type, describe } = req.body;
  const { error } = validateschema.validate(req.body);
  if (error) {
    res.status(400).send(
      objectValidate.error.details.map((e) => {
        return e.message;
      })
    );
    return;
  }
  const valid = authorization?.replace("bearer", "").trim();
  if (!valid) return res.sendStatus(401);
  try {
    const search = await database
      .collection("sessions")
      .findOne({ token: valid });
    const registeredUser = await database
      .collection("users")
      .findOne({ _id: search.userId });
    if (!registeredUser) return res.sendStatus(404);
    const account = {
      value,
      type,
      describe,
      time: dayjs().format("DD/MM"),
      user: registeredUser._id,
    };
    await database.collection("records").insertOne(account);
    res.status(201).send(account);
  } catch (e) {
    chalk.bold.red(console.log(e));
    res.sendStatus(409);
  }
});

app.get("/myrecords", async (req, res) => {
  const { authorization } = req.headers;
  const valid = authorization?.replace("Bearer ", "");
  if (!valid) return res.sendStatus(401);
  try {
    const search = await database.collection("sessions").findOne({ valid });
    if (!search) return res.sendStatus(401);

    const user = await database
      .collection("users")
      .findOne({ _id: search.userId });
    if (user) {
      const balance = await database
        .collection("records")
        .find({ userId: user._id })
        .toArray();
      if (!balance) return res.sendStatus(401);
      res.status(200).send(balance);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    chalk.bold.red(console.log(e));
    res.sendStatus(500);
  }
});
