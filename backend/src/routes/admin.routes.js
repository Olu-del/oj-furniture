const express = require("express");
const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");
const { getSustainabilityStats } = require("../controllers/admin.controller");

const router = express.Router();

router.get("/sustainability", auth, admin, getSustainabilityStats);

module.exports = router;
