const express = require('express');
const { createProduct, getProducts, searchProducts, getProductById, updateProduct, deleteProduct} = require('../controllers/product.controller');
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');


const router = express.Router();


// Protected route for adding products with image upload and admin check
// CREATE product (admin only)

// CREATE product (admin only)
router.post("/create", auth, admin, upload.single("image"),
  createProduct
);

// READ all products
router.get('/', getProducts);

// SEARCH products by name, category, colour, etc.
router.get('/search', searchProducts);

// READ single product (for editing)
router.get('/:id', getProductById);

// UPDATE product (admin only)
router.put(
  "/:id",
  auth,
  admin,
  upload.single("image"),
  updateProduct
);

// DELETE product (admin only)
router.delete(
  "/:id",
  auth,
  admin,
  deleteProduct
);




router.get('/search', searchProducts);

module.exports = router;
