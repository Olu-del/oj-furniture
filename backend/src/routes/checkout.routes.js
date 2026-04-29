const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { checkout } = require("../controllers/checkout.controller");

const router = express.Router();

// Checkout endpoint requires the user to be authenticated
router.post("/", auth, checkout);


module.exports = router;