const express = require("express");
const router = express.Router();
const multer = require("multer");
const Material = require("../models/material");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/materials");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/create", upload.single("file"), async (req, res) => {
  try {
    const { id_of_topic, title, description } = req.body;
    const file = req.file;

    const url_of_file = file ? file.filename : "";

    const newMaterial = new Material({
      id_of_topic,
      title,
      description,
      url_of_file,
    });

    const savedMaterial = await newMaterial.save();

    res.status(201).json({ success: true, material: savedMaterial });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
