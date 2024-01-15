import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import Leader from "../models/leaders";
import { MongooseError } from "mongoose";

export const leadersRouter = Router();

leadersRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const leaders = await Leader.find({});
      res.statusCode = StatusCodes.OK;
      return res.json({ success: true, data: leaders });
    } catch (error) {
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false });
    }
  })
  .post(async (req, res) => {
    try {
      const newLeader = req.body;
      await Leader.create(newLeader);
      res.statusCode = StatusCodes.CREATED;
      return res.json({ success: true, data: newLeader});
    } catch (error) {
      const mongooseError = error as MongooseError
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false, message: mongooseError.message });
    }
  })
  .put(async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("PUT operation not supported");
  })
  .delete(async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("DELETE operation not supported");
  });

  leadersRouter
  .route("/:leaderId")
  .get(async (req, res) => {
    try {
      const leaders = await Leader.findById(req.params.leaderId);
      res.statusCode = StatusCodes.OK;
      return res.json({ success: true, data: leaders });
    } catch (error) {
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false });
    }
  })
  .post(async (req, res) => {
       res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("POST operation not supported");
  })
  .put(async (req, res) => {
    try {
      await Leader.findByIdAndUpdate(req.params.leaderId,req.body);
      res.statusCode = StatusCodes.NO_CONTENT;
      return res.json({ success: true });
    } catch (error) {
      const mongooseError = error as MongooseError
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false, message: mongooseError.message });
    }
  })
  .delete(async (req, res) => {
    try {
      await Leader.findByIdAndDelete(req.params.leaderId)
      res.statusCode = StatusCodes.NO_CONTENT;
      return res.json({ success: true });
    } catch (error) {
      const mongooseError = error as MongooseError
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false, message: mongooseError.message });
    }
  });
