const mongoose = require("mongoose");

const course = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseDuration: {
      type: String,
      required: true,
      trim: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "can't be blank"],
    },
    whatYouWillLearn: {
      type: String,
      required: true,
      trim: true,
    },
    courseContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: [true, "can't be blank"],
      },
    ],
    ratingAndReview: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    tags: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: [true, "can't be blank"],
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "can't be blank"],
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);
const Course = mongoose.model("Course", course);
module.exports = Course;
