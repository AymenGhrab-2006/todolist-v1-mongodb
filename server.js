import "dotenv/config";
import express from "express";
import crypto from "crypto";
import { MongoClient, ObjectId } from "mongodb";
import cookieParser from "cookie-parser";

const client = new MongoClient(process.env.MONGO_URI);
const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.static("."));

function validateTask(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Invalid request body";
  }

  const { title, description } = body;

  if (
    typeof title !== "string" ||
    title.trim().length === 0 ||
    title.length > 30
  ) {
    return "Invalid title: required, max 30 characters";
  }

  if (
    typeof description !== "string" ||
    description.trim().length === 0 ||
    description.length > 255
  ) {
    return "Invalid description: required, max 255 characters";
  }

  return null;
}

function isValidObjectId(id) {
  return typeof id === "string" && ObjectId.isValid(id);
}

app.use((req, res, next) => {
  let userId = req.signedCookies.userId;
  if (!userId) {
    userId = crypto.randomUUID();
    res.cookie("userId", userId, {
      signed: true,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365 * 1000,
    });
  }
  req.userId = userId;
  next();
});

let mydb;

app.get("/api/task", async (req, res) => {
  try {
    const results = await mydb.find({ userId: req.userId }).toArray();
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
app.post("/ajout", async (req, res) => {
  const validationError = validateTask(req.body);

  if (validationError) {
    return res.status(400).json({
      error: validationError
    });
  }

  try {
    await mydb.insertOne({ ...req.body, userId: req.userId });
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
app.post("/modi", async (req, res) => {
  const validationError = validateTask(req.body);

  if (validationError) {
    return res.status(400).json({
      error: validationError,
    });
  }

  const { idm } = req.body;

  if (!isValidObjectId(idm)) {
    return res.status(400).json({
      error: "Invalid task ID",
    });
  }
  try {
    await mydb.updateOne(
      { _id: new ObjectId(req.body.idm), userId: req.userId },
      { $set: { title: req.body.title, description: req.body.description } }
    );
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post("/del", async (req, res) => {
  const { id } = req.body || {};

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      error: "Invalid task ID",
    });
  }
  try {
    await mydb.deleteOne({
      _id: new ObjectId(req.body.id),
      userId: req.userId,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

async function startserver() {
  try {
    await client.connect();
    mydb = client.db("bdtask").collection("tasks");
    app.listen(3000);
  } catch (error) {
    console.error(error);
  }
}
startserver();
