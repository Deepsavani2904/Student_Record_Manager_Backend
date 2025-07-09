const Student = require("../models/studentRecords");

const studentPersonalRecord = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await Student.findOne({ userId }).populate(
      "userId",
      "name email role"
    );

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student record not found" });
    }

    return res.status(200).json({
      success: true,
      data: student,
      message: "Student record fetched successfully!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

module.exports = {
  studentPersonalRecord,
};
