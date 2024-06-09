const User = require("../models/user");
const Course = require("../models/course");
const { instance } = require("../config/razorpay");
const mailSender = require("../utils/mailSender");

// capture payment and initiate transaction
async function capturePayment(req, res) {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    if (!courseId) {
      return res.json({
        success: false,
        message: "missing details course Id",
      });
    }

    let course;
    try {
      course = await Course.findById(courseId);
      if (!course) {
        return res.json({
          success: false,
          message: "missing details course Id",
        });
      }
      const uid = new mongoose.types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student is already enrolled",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    const amount = course.price;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        course_Id: courseId,
        userId,
      },
    };

    try {
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);
      return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        orderid: paymentResponse.id,
      });
    } catch (err) {
      console.log(err);
      return res.json({ success: false, message: "could not initiate order" });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}

async function verifySignature(req, res) {
  try {
    const webhook = "2354625";
    const signature = req.heaeder["x-razorpay-signature"];

    const shaAlgo = crypto.createHmac("sha256", webhook);
    shaAlgo.update(JSON.stringify(req.body));

    const digest = shaAlgo.digest("hex");

    if (signature === digest) {
      console.log("Payment is Authorised");

      const { courseId, userId } = req.body.payload.payment.entity.notes;
      try {
        const enrolledCourse = await Course.findOneAndUpdate(
          {
            _id: course_Id,
          },
          { $push: { studentsEnrolled: userId } },
          { new: true }
        );

        if (!enrolledCourse) {
          return res.status(500).json({
            success: false,
            message: "Course not found",
          });
        }
        console.log(enrolledCourse);

        const enrolledStudent = await User.findOneAndUpdate(
          {
            _id: userId,
          },
          { $push: { courses: course_Id } },
          { new: true }
        );

        console.log(enrolledCourse);

        // send mail
        const emailResponse = await mailSender(
          enrolledStudent.email,
          "Congratulations , you have successfully enrolled into course",
          "congratulation"
        );
        return res.status(200).json({
          success: true,
          message: "Signature verified",
        });
      } catch (err) {
        return res.status(500).json({
          success: true,
          message: err.message,
        });
      }
    } else {
    }
    return res.status(400).json({
      success: false,
      message: "Signature invalid",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "unable to verify signature. Please try again",
    });
  }
}
