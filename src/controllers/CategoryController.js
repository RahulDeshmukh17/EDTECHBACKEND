const Tags = require("../models/category");

async function createCategory(req, res) {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    const tagDetails = await Tags.create({
      name: name,
      description: description,
    });

    console.log(tagDetails);
    return res.status(200).json({
      success: fasle,
      message: "Tag create successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function showAllCategory(req, res) {
  try {
    const allTags = await Tags.find({}, { name: true, description: true });
    return res.status(200).json({
      success: fasle,
      message: "all tags return successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = { createCategory, showAllCategory };
