const Course = require("../models/course");
const Category = require("../models/category");
const User = require("../models/user");
const { uploadImageCloudinary } = require("../utils/imageUploader");

async function createCourse(req, res) {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    const thumbnail = req.files.thumbnailImage;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("instructor details :", instructorDetails);
    // check user._id and instructordDetails._id is same or not

    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "instructor details not found",
      });
    }

    const tagDetails = await Category.findById(tag);
    if (!tagDetails) {
      return res.status(400).json({
        success: false,
        message: "tag details not found",
      });
    }

    const thumbnailImage = await uploadImageCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    //category
    await Category.findByIdAndUpdate(
      { _id: tagDetails._id },
      { $push: { courses: newCourse._id } }
    );

    return res.status(200).json({
      success: true,
      message: "course created successfully",
      data: newCourse,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "faile to create course",
      error: err.message,
    });
  }
}

async function getAllCourses(req, res) {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReview: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.ststus(200).json({
      success: true,
      message: "data for all courses fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "cannot fetch data",
      error: err.message,
    });
  }
}
