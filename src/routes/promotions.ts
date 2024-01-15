import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import Promotion from "../models/promotions";
import { MongooseError } from "mongoose";

export const promotionsRouter = Router();

promotionsRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const promotions = await Promotion.find({});
      res.statusCode = StatusCodes.OK;
      return res.json({ success: true, data: promotions });
    } catch (error) {
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false });
    }
  })
  .post(async (req, res) => {
    try {
      const newPromotion = req.body;
      await Promotion.create(newPromotion);
      res.statusCode = StatusCodes.CREATED;
      return res.json({ success: true, data: newPromotion});
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

  promotionsRouter
  .route("/:promotionId")
  .get(async (req, res) => {
    try {
      const promotions = await Promotion.findById(req.params.promotionId);
      res.statusCode = StatusCodes.OK;
      return res.json({ success: true, data: promotions });
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
      await Promotion.findByIdAndUpdate(req.params.promotionId,req.body);
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
      await Promotion.findByIdAndDelete(req.params.promotionId)
      res.statusCode = StatusCodes.NO_CONTENT;
      return res.json({ success: true });
    } catch (error) {
      const mongooseError = error as MongooseError
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false, message: mongooseError.message });
    }
  });
