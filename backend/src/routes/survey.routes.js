const express = require("express");
const surveyController = require("../controllers/survey.controller");
const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");



const router = express.Router();

// Create survey
router.post("/", auth, surveyController.createSurvey);

// Get survey for an order
router.get("/:orderId", auth, surveyController.getSurveyByOrder);

// Admin (optional)
router.get("/", auth, surveyController.getAllSurveys);

// Admin (optional)
router.get("/", auth, admin, surveyController.getAllSurveys);

module.exports = router;