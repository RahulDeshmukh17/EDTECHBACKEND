const mongoose = require("mongoose");

const section = new mongoose.Schema(
  {
    sectionName: {
      type: String,
    },
    subSection: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "can't be blank"],
        ref: "SubSection",
      },
    ],
  },
  { timestamps: true }
);

const Section = mongoose.model("Section", section);
module.exports = Section;
