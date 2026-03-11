const express = require("express");
const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");
const {
  submitComplaint,
  getAllComplaints,
  updateComplaintStatus
} = require("../controllers/complaint.controller");

const router = express.Router();

// USER submits complaint
router.post("/", auth, submitComplaint);

// ADMIN views all complaints
router.get("/", auth, admin, getAllComplaints);

// ADMIN updates complaint status
router.put("/:id", auth, admin, updateComplaintStatus);

module.exports = router;
