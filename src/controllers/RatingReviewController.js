const RatingReview = require("../models/ratingAndReview");
const Course = require("../models/course");
const User = require("../models/user");

async function createRating(req, res) {
  try {
    const userId = req.user.id;
    const { courseId, rating, review } = req.body;
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Student is not enrolled",
      });
    }

    const alreadyReviewed = await RatingReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "course already reviewd by user",
      });
    }

    const ratingRev = await RatingReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { ratingAndReview: ratingRev._id },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Rating & review created successfully",
    });
  } catch (err) {}
  return res.status(500).json({
    success: false,
    error: err.message,
    message: "unable to create rating ",
  });
}

async function avgRating(req, res) {
  try {
    const { courseId } = req.body;
    const result = await RatingReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          avrageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    return res.status(200).json({
      success: true,
      averageRating: 0,
      message: "average rating is 0",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getAllRating(req, res) {
  try {
    const getAllRating = await RatingReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
