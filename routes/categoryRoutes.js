const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../middlewares/verifyToken');

// Categories
router.get('/categories', categoryController.getCategories);
router.post('/categories', verifyToken, categoryController.createCategory);

// Subcategories
router.get('/subcategories', categoryController.getSubcategories);
router.post('/subcategories', verifyToken, categoryController.createSubcategory);

module.exports = router;
