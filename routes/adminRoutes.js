const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const authMiddleware = require('../middlewares/authMiddleware');

// Get all doctors route
router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in fetching doctors data",
      success: false,
      error,
    });
  }
});

// Get all users route
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in fetching users data",
      success: false,
      error,
    });
  }
});

router.post("/change-doctor-account-status", authMiddleware, async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(doctorId, {
      status,
    });

    const user = await User.findOne({ _id: doctor.userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "doctor-request-changed",
      message: `Your doctor account has been ${status}`,
      onClickPath: "/notifications",
    });

    // Update isDoctor based on status
    user.isDoctor = status === "approved"; //if approved then it is true 

    // Save user updates before sending the response
    await user.save();

    res.status(200).send({
      message: "Doctor status updated successfully",
      success: true,
      data: doctor,
    });

    await User.findByIdAndUpdate(user._id, { unseenNotifications });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in updating doctor status",
      success: false,
      error,
    });
  }
});

module.exports = router;
 