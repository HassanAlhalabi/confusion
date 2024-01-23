import express, { RequestHandler } from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import session from "express-session";
import passport from "passport";

import { dishRouter } from "./routes/dish";
import { promotionsRouter } from "./routes/promotions";
import { leadersRouter } from "./routes/leaders";
import homeRouter from "./routes/home";
import { userRouter } from "./routes/user";
import './authenticate';

const DBURL = "mongodb://127.0.0.1:27017/confusion";
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

server.use(session({
  name: 'session-id',
  secret: process.env.COOKIE_SECRET_KEY as string,
  saveUninitialized: false,
  resave: false,
  cookie: { secure: true }
}));

server.use(passport.initialize());
server.use(passport.session());

const auth: RequestHandler = (req, res, next) => {
    console.log(req.user);
    if (!req.user) {
      const err = new Error('You are not authenticated!');
      // @ts-ignore
      err.status = 403;
      next(err);
    }
    else {
      next();
    }
}

server.use(auth)

server.use('/', homeRouter);
server.use('/users', userRouter);
server.use('/dishes', dishRouter);
server.use('/promotions', promotionsRouter);
server.use('/leaders', leadersRouter);

server.route("*").get((req, res) => {
  res.send("404");
});

server.listen(PORT);
