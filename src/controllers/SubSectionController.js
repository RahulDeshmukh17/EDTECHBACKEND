const SubSection = require("../models/subSection");
const Section = require("../models/section");
const uploadImageCloudinary = require("../utils/imageUploader");

async function createSubSection(req, res) {
  try {
    const { sectionId, title, timeDuration, description } = req.body;

    const video = req.files.videoFile;
    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "missing properties",
      });
    }

    const uploadFile = await uploadImageCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadFile.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: { subSection: subSectionDetails._id },
      },
      { new: true }
    )
      .populate(subSection)
      .exec();

    return res.status(200).json({
      success: true,
      message: "sub section created successfully",
      updatedSection,
    });
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: "unable to create subsection",
    });
  }
}

//update
//delete
