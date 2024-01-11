import express from "express";
import mongoose from "mongoose";

import { dishRouter } from "./routes/dish";

const DBURL = "mongodb://127.0.0.1:27017/confusion";
const PORT = 5000;

const server = express();

server.use(express.json());
server.use(dishRouter);

server.route("*").get((req, res) => {
  res.send("404");
});

server.listen(PORT, () => {
  console.log("Listening...");
  // Connect to database
  mongoose
    .connect(DBURL)
    .then((connection) => {
      console.log("Connected to db");
    })
    .catch((error) => console.log(error));
});