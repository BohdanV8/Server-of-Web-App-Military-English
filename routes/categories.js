const express = require("express");
const router = express.Router();
const Category = require("../models/category");
router.get("/all", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
