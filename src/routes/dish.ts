import { Router, json } from "express";
import Dish from "../models/dish";
import { StatusCodes } from "http-status-codes";

export const dishRouter = Router();
dishRouter.use(json());

dishRouter
  .route("/dishes")
  .get(async (req, res) => {
    try {
      const dishes = await Dish.find();
      res.statusCode = StatusCodes.OK;
      return res.json({ success: true, data: dishes });
    } catch (error) {
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false });
    }
  })
  .post(async (req, res) => {
    try {
      const newDish = req.body;
      await Dish.create(newDish);
      res.statusCode = StatusCodes.CREATED;
      return res.json({ success: true, data: newDish });
    } catch (error) {
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false });
    }
  })
  .put(async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("PUT operation not supported for dises");
  })
  .delete(async (req, res) => {});
