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