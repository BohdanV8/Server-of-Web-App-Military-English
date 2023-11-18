const express = require("express");
const router = express.Router();
const multer = require("multer");
const Topic = require("../models/topic");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/topics");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/create", upload.single("file"), async (req, res) => {
  try {
    const { id_of_course, title, description } = req.body;
    const file = req.file;

    const url_of_photo = file ? file.filename : "";

    const newTopic = new Topic({
      id_of_course,
      title,
      description,
      url_of_photo,
    });

    const savedTopic = await newTopic.save();

    res.status(201).json({ success: true, topic: savedTopic });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
