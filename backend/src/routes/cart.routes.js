const express = require("express");
const auth = require("../middlewares/auth.middleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  mergeCart
} = require("../controllers/cart.controller");



console.log({
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  mergeCart
});
const router = express.Router();

router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.put("/update", auth, updateCartItem);
router.delete("/remove/:productId", auth, removeCartItem);
router.post("/merge", auth, mergeCart);
module.exports = router;