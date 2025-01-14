import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware.js";

const app = express();

// Signup Route
app.post("/signup", async (req, res) => {
  // signup logic here
});

// Signin Route
app.post("/signin", async (req, res) => {
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({ message: "user signed in", token: token });
});

// Create Room
//@ts-ignore Todo : Fix the error
app.post("/room", middleware, async (req, res) => {
  // create room logic here
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
