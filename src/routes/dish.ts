import { Router } from "express";
import Dish from "../models/dish";
import { StatusCodes } from "http-status-codes";
import { MongooseError } from "mongoose";
import { verifyUser } from "../authenticate";

export const dishRouter = Router();

dishRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const dishes = await Dish.find({}).populate('comments.author');
      res.statusCode = StatusCodes.OK;
      return res.json({ success: true, data: dishes });
    } catch (error) {
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false });
    }
  })
  .post(verifyUser, async (req, res) => {
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
  .put(verifyUser, async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("PUT operation not supported for dishes");
  })
  .delete(verifyUser, async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("DELETE operation not supported for dishes");
  });

  dishRouter
  .route("/:dishId")
  .get(async (req, res) => {
    try {
      const dish = await Dish.findById(req.params.dishId).populate('comments.author');
      res.statusCode = StatusCodes.OK;
      return res.json({ success: true, data: dish });
    } catch (error) {
      const mongooseError = error as MongooseError
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false, error: mongooseError.message });
    }
  })
  .put(verifyUser, async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("PUT operation not supported for dishes");
  })
  .delete(verifyUser, async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("DELETE operation not supported for dishes");
  });

  dishRouter
  .route("/:dishId/comments")
  .get(async (req, res) => {
    try {
      const dishes = await Dish.findById(req.params.dishId).populate('comments.author');
      res.statusCode = StatusCodes.OK;
      return res.json({ success: true, data: dishes?.comments });
    } catch (error) {
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false });
    }
  })
  .post(verifyUser, async (req, res) => {
    try {
      const newComment = req.body;
      await Dish.findByIdAndUpdate(req.params.dishId,{
        $push: {
          comments: newComment
        }
      });
      const dish = await Dish.findById(req.params.dishId)
                              .populate('comments.author')
      res.statusCode = StatusCodes.CREATED;
      res.setHeader('Content-Type', 'application/json');       
      return res.json({ success: true, data: dish });
    } catch (error) {
      const mongooseError = error as MongooseError
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false, error: mongooseError.message });
    }
  })
  .put(verifyUser, async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("PUT operation not supported for comments");
  })
  .delete(verifyUser, async (req, res) => {
    res.statusCode = StatusCodes.FORBIDDEN;
    return res.end("DELETE operation not supported for Comments");
  });


  dishRouter
  .route("/:dishId/comments/:commentId")
  .get(async (req, res) => {
    try {
      const dish = await Dish.findById(req.params.dishId).populate('comments.author') ;
      res.statusCode = StatusCodes.OK;
      return res.json({ success: true, data: dish ? dish.comments.filter(comment => comment._id+'' === req.params.commentId)[0] : null });
    } catch (error) {
      const mongooseError = error as MongooseError
      res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return res.json({ success: false, message: mongooseError.message });
    }
  })
  .post(verifyUser, async (req, res) => {
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
  .put(verifyUser, async (req, res, next) => {
   Dish.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
              // @ts-ignore
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
              // @ts-ignore
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
        dish.save()
        .then((dish) => {
            Dish.findById(dish._id)
            .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);  
            })              
        }, (err) => next(err));
        }
        else if (dish == null) {
            res.statusCode = 404;
            return next(new Error('Dish ' + req.params.dishId + ' not found'));
        }
        else {
            res.statusCode = 404;
            return next(new Error('Comment ' + req.params.commentId + ' not found'))            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
  })
.delete(verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {

          // @ts-ignore
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                Dish.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);  
                })               
            }, (err) => next(err));
        }
        else if (dish == null) {
            res.statusCode = 404;
            return next(new Error('Dish ' + req.params.dishId + ' not found'));
        }
        else {
            res.statusCode = 404;
            return next(new Error('Comment ' + req.params.commentId + ' not found'))            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});
