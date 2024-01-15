import mongoose from "mongoose";

const leaderSchema = new mongoose.Schema(
  {
      name: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      designation: {
        type: String,
        required: true
      },
      abbr:{
        type: String,
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

const Leader = mongoose.model("Leader", leaderSchema, "leaders");

export default Leader;
