const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "can't be  blank"],
    match: [/\S+@\S.\S+/, "is invalid"],
    trim: true,
    index: {
      unique: true,
    },
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password cannot be less than 8 characters"],
  },
  role: {
    type: String,
    enum: ["Admin", "Student", "Instructor"],
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    },
  ],
  image: {
    type: String,
    required: true,
  },
  courseProgress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    },
  ],
});

userSchema.plugin(uniqueValidator, { message: "is already taken." });

const User = mongoose.model("User", userSchema);
module.exports = User;
