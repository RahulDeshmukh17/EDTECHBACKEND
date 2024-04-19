const mongoose = require("mongoose");

const courseProgress = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "can't be blank"],
    },
    completedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
      },
    ],
  },
  { timestamps: true }
);
const CourseProgress = mongoose.model("CourseProgress", courseProgress);
module.exports = CourseProgress;
