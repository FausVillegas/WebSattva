const express = require('express');

const { body } = require('express-validator');

const productsController = require('../controllers/products');

const { isAuthenticated, isAdmin } = require('../middleware/auth');

const router = express.Router();

const authController = require('../controllers/auth');
const upload = require('../middleware/upload');

router.get('/', productsController.fetchAll)

router.post(
    // '/products',
    '/',
    upload.single('imageUrl'),
    [
        isAuthenticated, isAdmin,
        body('title').trim().not().isEmpty(),
        body('description').trim().not().isEmpty(),
        body('price').trim().not().isEmpty(),
        body('category').trim().not().isEmpty(),
        body('stock').trim().not().isEmpty(),
        // body('id_supplier').trim().not().isEmpty(),
    ], productsController.postProduct
);

router.delete(
    // '/products/:id', productsController.deleteProduct
    '/:id', isAuthenticated, isAdmin, productsController.deleteProduct
);

module.exports = router;