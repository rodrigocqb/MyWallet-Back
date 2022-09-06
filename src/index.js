import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import { stripHtml } from "string-strip-html";
import dayjs from "dayjs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => {
  db = mongoClient.db("my_wallet");
});

app.listen(5000, () => console.log("Server listening on port 5000!"));
