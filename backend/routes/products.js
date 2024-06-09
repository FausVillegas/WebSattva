const express = require('express');

const { body } = require('express-validator');

const productsController = require('../controllers/products');

const auth = require('../middleware/auth')

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/', auth, productsController.fetchAll)

router.post(
    // '/products',
    '/',
    [
        auth,
        body('title').trim().not().isEmpty(),
        body('description').trim().not().isEmpty(),
        body('price').trim().not().isEmpty(),
        body('category').trim().not().isEmpty(),
        body('stock').trim().not().isEmpty(),
        body('image').trim().not().isEmpty(),
        // body('id_supplier').trim().not().isEmpty(),
    ], productsController.postProduct
);

router.delete(
//     '/products/:id', productsController.deleteProduct
    '/:id', auth, productsController.deleteProduct
);

module.exports = router;