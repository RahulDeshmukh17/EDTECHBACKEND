const mongoose = require("mongoose");

const tags = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    course: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const Tags = mongoose.model("Tag", tags);
module.exports = Tags;
