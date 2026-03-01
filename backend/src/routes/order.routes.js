const express = require("express");
const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");
const {
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/order.controller");

const router = express.Router();

router.get("/my", auth, getUserOrders);
router.get("/", auth, admin, getAllOrders);
router.put("/:id/status", auth, admin, updateOrderStatus);

module.exports = router;