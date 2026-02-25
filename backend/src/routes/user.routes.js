const express = require("express");
const router = express.Router();
const { getMe } = require("../controllers/user.controller");
// Protected route to get current user info
router.get("/me", getMe);

module.exports = router;
