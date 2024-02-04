import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import passport from "passport";

import { dishRouter } from "./routes/dish";
import { promotionsRouter } from "./routes/promotions";
import { leadersRouter } from "./routes/leaders";
import homeRouter from "./routes/home";
import { userRouter } from "./routes/user";
import './authenticate';
import { config } from "../config";

const DBURL = config.mongoUrl;
const PORT = 5000;

  // Connect to database
  mongoose
    .connect(DBURL)
    .then((connection) => {
      console.log("Connected to db");
    })
    .catch((error) => console.log(error));

const server = express();

server.use(express.json());
server.use(passport.initialize());
server.use(passport.session());

server.use('/users', userRouter);
server.use('/dishes', dishRouter);
server.use('/promotions', promotionsRouter);
server.use('/leaders', leadersRouter);
server.use('/', homeRouter);

server.route("*").get((req, res) => {
  res.send("404");
});

server.listen(PORT);
