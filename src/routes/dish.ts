import { Router } from "express";
import Dish from "../models/dish";
import { StatusCodes } from "http-status-codes";
import { MongooseError, ObjectId } from "mongoose";

export const dishRouter = Router();

dishRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const dishes = await Dish.find({});
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
      const mongooseError = error as MongooseError
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false, error: mongooseError.message});
    }
  })
  .put(async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("PUT operation not supported for dishes");
  })
  .delete(async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("DELETE operation not supported for dishes");
  });

  dishRouter
  .route("/:dishId")
  .get(async (req, res) => {
    try {
      const dish = await Dish.findById(req.params.dishId);
      res.statusCode = StatusCodes.OK;
      return res.json({ success: true, data: dish });
    } catch (error) {
      const mongooseError = error as MongooseError
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false, error: mongooseError.message });
    }
  })
  .put(async (req, res) => {

    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("PUT operation not supported for dishes");
  })
  .delete(async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("DELETE operation not supported for dishes");
  });

  dishRouter
  .route("/:dishId/comments")
  .get(async (req, res) => {
    try {
      const dishes = await Dish.findById(req.params.dishId);
      res.statusCode = StatusCodes.OK;
      return res.json({ success: true, data: dishes?.comments });
    } catch (error) {
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false });
    }
  })
  .post(async (req, res) => {
    try {
      const newComment = req.body;
      await Dish.findByIdAndUpdate(req.params.dishId,{
        $push: {
          comments: newComment
        }
      });
      res.statusCode = StatusCodes.CREATED;
      return res.json({ success: true, data: newComment });
    } catch (error) {
      const mongooseError = error as MongooseError
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false, error: mongooseError.message });
    }
  })
  .put(async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("PUT operation not supported for comments");
  })
  .delete(async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("DELETE operation not supported for Comments");
  });


  dishRouter
  .route("/:dishId/comments/:commentId")
  .get(async (req, res) => {
    try {
      const dish = await Dish.findById(req.params.dishId);
      res.statusCode = StatusCodes.OK;
      return res.json({ success: true, data: dish ? dish.comments.filter(comment => comment._id+'' === req.params.commentId)[0] : null });
    } catch (error) {
      const mongooseError = error as MongooseError
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false, message: mongooseError.message });
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
    return res.end("PUT operation not supported for dishes");
  })
  .delete(async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("DELETE operation not supported for dishes");
  });
