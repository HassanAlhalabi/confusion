import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
      name: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      label:  {
        type: String,
        default: ""
      },
      price: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      featured: {
        type: Boolean,
        required: true
      }
  });

const Promotion = mongoose.model("Promotion", promotionSchema, "promotions");

export default Promotion;
