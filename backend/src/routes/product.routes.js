const express = require('express');
const { createProduct, getProducts, searchProducts } = require('../controllers/product.controller');
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');


const router = express.Router();


// Protected route for adding products with image upload and admin check
router.post("/create", auth, admin, upload.single("image"),
  createProduct
);

// Public routes
router.get('/', getProducts);


router.get('/search', searchProducts);

module.exports = router;
