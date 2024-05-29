const Section = require("../models/section");
const Course = require("../models/course");

async function createSection(req, res) {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }
    const newSection = await Section.create({ sectionName });

    const updateCourseDetail = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection.id } },
      { new: true }
    )
      .populate(courseContent)
      .exec();

    return res.status(200).json({
      success: true,
      message: "section created successfully",
      updateCourseDetail,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "unable to create section",
      error: err.message,
    });
  }
}

async function updateSection(req, res) {
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionName || !sectionId) {
      return res.status(200).json({
        success: true,
        message: "Missing properties",
      });
    }
    const updatedSection = await Section.findByIdAndUpdate(
      { sectionId },
      { sectionName },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "section updated successfully",
      updatedSection,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "unable to update section",
      error: err.message,
    });
  }
}

async function deleteSection(req, res) {
  try {
    const { sectionId } = req.params;

    await Section.findByIdAndDelete({ sectionId });
    // do we need to delete the enrty from course schema

    return res.status(200).json({
      success: true,
      message: "section deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "unable to delete section",
      error: err.message,
    });
  }
}
