const User = require("../models/user");
const mailSender = require("../utils/mailSender");

async function resetPasswordExpires(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({ success: false, message: "Email is not regiestered" });
    }

    const token = crypto.randomUUID();
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPssswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    const url = `https://localhost:3000/update-token/${token}`;

    await mailSender(
      email,
      "Password reset Link",
      `Password reset Link: ${url}`
    );
    return res.json({
      success: true,
      message:
        "email sent successfully, please check email and change password",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: true,
      message:
        "email sent successfully, please check email and change password",
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { password, confirmPassword, token } = req.body;
    if (password != confirmPassword) {
      return res.json({ success: true, message: "password not matching" });
    }
    const userDetails = await User.findOne({ token: token });

    if (!userDetails) {
      return res.json({ success: true, message: "token is invalid" });
    }
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: true,
        message: "token is expired, please regenereate your token",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "password reset successfullyz",
    });
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: "something went wrong while password reset",
    });
  }
}
