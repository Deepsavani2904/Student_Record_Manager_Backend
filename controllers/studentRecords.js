const Student = require("../models/studentRecords");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const addStudentByAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      rollNumber,
      course,
      age,
      standard,
      division,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const rollExists = await Student.findOne({ rollNumber });
    if (rollExists) {
      return res.status(409).json({ message: "Roll number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const newStudent = await Student.create({
      userId: newUser._id,
      rollNumber,
      course,
      age,
      standard,
      division,
    });

    return res
      .status(201)
      .json({ message: "Student created successfully", student: newStudent });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

const getStudentsByAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", sort = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const searchFilter = {};
    if (search) {
      searchFilter.$or = [
        { course: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    let sortStage = {};
    if (sort) {
      const [field, order] = sort.split(":");
      const sortOrder = order === "desc" ? -1 : 1;
      sortStage[field] = sortOrder;
    } else {
      sortStage = { createdAt: -1 };
    }

    const result = await Student.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $addFields: {
          name: "$userInfo.name",
          email: "$userInfo.email",
          role: "$userInfo.role",
        },
      },

      {
        $project: {
          userInfo: 0,
          __v: 0,
        },
      },

      { $match: searchFilter },
      {
        $facet: {
          data: [
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limitNumber },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const students = result[0].data;
    const totalStudents = result[0].totalCount[0]?.count || 0;

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully!",
      data: students,
      total: totalStudents,
      page: pageNumber,
      limit: limitNumber,
    });
  } catch (error) {
    console.error("Error in getStudentsByAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

const getOneStudentByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id).populate(
      "userId",
      "name email role"
    );
    if (!student) return res.status(404).json({ message: "Student not found" });

    return res
      .status(200)
      .json({
        success: true,
        data: student,
        message: "Student get successfully!",
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

const updateStudentByAdmin = async (req, res) => {
  try {
    const { studentId, course, age, standard, division } = req.body;

    const payLoad = {
      course,
      age,
      standard,
      division,
    };

    const isStudentAvailable = await Student.findOne({ _id: studentId });
    if (!isStudentAvailable) {
      return res
        .status(400)
        .json({ success: false, message: "Student not found!" });
    }

    await Student.findByIdAndUpdate({ _id: studentId }, { $set: payLoad });

    return res
      .status(200)
      .json({ success: true, message: "Student updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

const deleteStudentByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({ _id: id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Student.findByIdAndDelete(id);

    await User.findByIdAndDelete(student.userId);

    return res
      .status(200)
      .json({ message: "Student and user account deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

module.exports = {
  addStudentByAdmin,
  getStudentsByAdmin,
  getOneStudentByAdmin,
  updateStudentByAdmin,
  deleteStudentByAdmin,
};
