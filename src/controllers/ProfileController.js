const Profile = require("../models/profile");
const User = require("../models/user");

async function updatedProfile(req, res) {
  try {
    const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;

    const id = req.user.id;
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "missing details",
      });
    }

    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "profile updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
}

// delete account

// schedule delete account process
async function deleteAccount(req, res) {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "missing details",
      });
    }
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    //unenroll user form course
    await User.findByIdAndDelete({ _id: userDetails.courses });

    await User.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "profile delete successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete profile",
    });
  }
}
