const express = require("express");
const router = express.Router();
const multer = require("multer");
const Course = require("../models/course");
const jwt = require("jsonwebtoken");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/courses"); // Шлях до папки для збереження файлів на сервері
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/create", upload.single("file"), async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "viva");
    const userId = decodedToken.userId;
    const { title, description, category } = req.body;
    const file = req.file; // Об'єкт файлу, який надсилається через форму

    const url_of_photo = file ? file.filename : "";
    // Створення нового курсу в базі даних
    const newCourse = new Course({
      id_of_courseModerator: userId,
      title,
      description,
      id_of_category: category,
      url_of_photo,
    });

    const savedCourse = await newCourse.save();

    res.status(201).json({ success: true, course: savedCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/allCoursesOfModerator", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "viva");
    const userId = decodedToken.userId;
    const courses = await Course.find({ id_of_courseModerator: userId }).sort({
      date: -1,
    });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/wantedModeratorCourses", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "viva");
    const userId = decodedToken.userId;
    const { category, searchString } = req.query;
    if (category && !searchString) {
      var courses = await Course.find({
        id_of_courseModerator: userId,
        id_of_category: category,
      }).sort({
        date: -1,
      });
    } else if (searchString && !category) {
      var courses = await Course.find({
        id_of_courseModerator: userId,
        title: searchString,
      }).sort({
        date: -1,
      });
    } else if (category && searchString) {
      var courses = await Course.find({
        id_of_courseModerator: userId,
        title: searchString,
        id_of_category: category,
      }).sort({
        date: -1,
      });
    } else {
      var courses = await Course.find({ id_of_courseModerator: userId }).sort({
        date: -1,
      });
    }
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads/courses", filename);
  res.sendFile(filePath);
});

module.exports = router;
