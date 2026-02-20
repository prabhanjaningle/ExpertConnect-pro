const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// ===============================
// Create Booking
// ===============================
router.post("/", async (req, res) => {
  try {
    const { date } = req.body;

    // 🔥 Prevent past date booking
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingDate = new Date(date);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot book a past date."
      });
    }

    const booking = new Booking(req.body);
    await booking.save();

    // 🔥 Emit real-time event
    const io = req.app.get("io");

    io.emit("slotBooked", {
      expertId: booking.expertId,
      date: booking.date,
      time: booking.time
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked."
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// ===============================
// Get Bookings by Email
// ===============================
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const bookings = await Booking.find({ email });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// ===============================
// Update Booking Status
// ===============================
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Confirmed", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updatedBooking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;