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

router.get("/byId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
