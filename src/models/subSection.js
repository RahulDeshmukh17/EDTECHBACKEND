const mongoose = require("mongoose");

const subSection = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    timeDuration: {
      type: String,
    },
    description: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
  },
  { timestamps: true }
);
const SubSection = mongoose.model("SubSection", subSection);
module.exports = SubSection;
