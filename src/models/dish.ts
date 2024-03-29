import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
  },
  {
    timestamps: true,
  }
);

const DishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    featured: { type: Boolean, default: false },
    description: String,
    label: {
      type: String,
      default: "",
    },
    price: { type: Number, required: true, min: 0 },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Dish = mongoose.model("Dish", DishSchema, "dishes");

export default Dish;
