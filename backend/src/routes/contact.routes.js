const express = require("express");
const { submitContact } = require("../controllers/contact.controller");


// Create router for contact routes
const router = express.Router();


// Route for submitting contact form
router.post("/", submitContact);



module.exports = router;
