const express = require('express');
const { createProduct, getProducts, searchProducts } = require('../controllers/product.controller');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

// Protected route for adding products
router.post('/create', auth, createProduct);

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);

module.exports = router;
