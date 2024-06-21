const mongoose = require("mongoose");

const ratingAndReview = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "can't be blank"],
      ref: "User",
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "can't be blank"],
      ref: "Course",
      trim: true,
    },
  },
  { timestamps: true }
);
const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReview);
module.exports = RatingAndReview;
