const User = require("../models/user");
const OTP = require("../models/otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function sendOtp(req, res) {
  try {
    const { email } = req.body;
    const checkUserExist = await user.findOne({ email });
    if (checkUserExist) {
      return res.status(401).json({
        success: false,
        message: "user already registered",
      });
    }
    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generated successfully :", otp);

    //   check unique otp
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    // craete entry in DB
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "otp sent successfully",
      otp,
    });
  } catch (err) {
    console.log(err);
  }
}

async function signUp(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "all fields are required",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password value and corfirm passwords value not matched",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    const recentOtp = await OTP.find({ email })
      .sort({ createdAr: -1 })
      .limit(1);
    console.log(recentOtp);
    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "otp not found",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "invalid otp",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 9);
    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profile._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    return res.status(200).json({
      success: true,
      message: "User is registred successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "User cannot registred , please try again",
    });
    throw err;
  }
}

async function singIn(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        success: fasle,
        messsage: "All fields are required",
      });
    }
    const user = await User.findOne({ email }).populate(additionalDetails);
    if (!user) {
      return res.status(401).json({
        success: fasle,
        messsage: "User not registered,please signUp",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payLoad = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //   3*24*60*60*1000 = 3days
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };
      //cookie
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "logged in successfully",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "password is incorrect",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function changePassword(req, res) {
  //get data from req body
  try {
    // get old password,new password, confirmpassword
    //validation
    // update password in db
    // send mail password updated
    // return response
  } catch (err) {}
}
