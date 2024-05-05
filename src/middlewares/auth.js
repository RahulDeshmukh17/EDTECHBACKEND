const jwt = require("jwt");
const User = require("../models/user");
require("dotenv");

async function auth(req, res, next) {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: true,
        message: "token is missing",
      });
    }
    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = token;
    } catch (err) {
      return res.status(401).json({
        success: true,
        message: "token is invalid",
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      success: true,
      message: "Something went worng",
    });
  }
}

async function isStudents(req, res, next) {
  try {
    if (req.user.accountType != "Student") {
      return res.status(401).json({
        success: true,
        message: "this is protected route for student only",
      });
    }
  } catch (err) {
    return res.status(401).json({
      success: true,
      message: "user role cannot be vrified",
    });
  }
}

async function isInstructor(req, res, next) {
  try {
    if (req.user.accountType != "Instructor") {
      return res.status(401).json({
        success: true,
        message: "this is protected route for stuinstructor only",
      });
    }
  } catch (err) {
    return res.status(401).json({
      success: true,
      message: "user role cannot be vrified",
    });
  }
}

async function isAdmin(req, res, next) {
  try {
    if (req.user.accountType != "Admin") {
      return res.status(401).json({
        success: true,
        message: "this is protected route for Admin only",
      });
    }
  } catch (err) {
    return res.status(401).json({
      success: true,
      message: "user role cannot be vrified",
    });
  }
}
