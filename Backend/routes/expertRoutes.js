const express = require("express");
const router = express.Router();
const Expert = require("../models/Expert");


// ==================================
// GET All Experts (Pagination + Filter)
// ==================================
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 5, category } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    const experts = await Expert.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Expert.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      data: experts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});


// ==================================
// GET Single Expert by ID
// ==================================
router.get("/:id", async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: "Expert not found"
      });
    }

    res.status(200).json({
      success: true,
      data: expert
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

router.post("/seed", async (req, res) => {
  try {
    const experts = await Expert.insertMany([
      { name: "Rahul Sharma", category: "Astrology", experience: 5, rating: 4.7 },
      { name: "Anita Verma", category: "Career", experience: 8, rating: 4.9 },
      { name: "Vikram Rao", category: "Finance", experience: 6, rating: 4.6 }
    ]);

    res.status(201).json({
      success: true,
      data: experts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;