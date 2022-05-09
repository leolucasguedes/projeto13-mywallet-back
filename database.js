import { MongoClient } from "mongodb";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

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

export default database;
