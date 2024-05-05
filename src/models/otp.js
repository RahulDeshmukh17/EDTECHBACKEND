const mongoose = require("mongoose");
const mailsender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    requried: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

async function verificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification email form carsjagat",
      otp
    );
    console.log("Email Sent Successfully: ", mailResponse);
  } catch (err) {
    console.log(err);
  }
}

OTPSchema.pre("save", async function (next) {
  await verificationEmail(this.email, this.otp);
  next();
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;
