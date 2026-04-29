const express = require("express");
const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");
const {
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  updateDeliveryStatus
} = require("../controllers/order.controller");

const router = express.Router();
// Order routes for users and admins
router.get("/my", auth, getUserOrders);
router.get("/", auth, admin, getAllOrders);
router.put("/:id/status", auth, admin, updateOrderStatus);
router.put("/:id/delivery-status", auth, admin, updateDeliveryStatus);


module.exports = router;