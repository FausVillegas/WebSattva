const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const fs = require('fs')
const Product = require('../models/product');
const path = require('path');

exports.fetchAll = async (req, res, next) => {
    try {
        const [allProducts] = await Product.fetchAll();
        res.status(200).json(allProducts);
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
};

exports.postProduct = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return console.error("Error "+errors);
    }

    // const title = req.body.title; 
    // const description = req.body.description; 
    // const price = req.body.price; 
    // const category = req.body.category; 
    // const stock = req.body.stock;
    // const imageUrl = req.body.imageUrl;
    // const idSupplier = req.body.id_supplier;
    
    const { title, description, price, category, stock } = req.body;
    const imageUrl = req.file.path;

    // console.info("Controllers/Products.js"+req.body);
    // console.info(idSupplier);

    try {
        const product = {
            title: title, 
            description: description,
            price: price, 
            category: category,
            stock: stock,
            imageUrl: imageUrl,
            // idSupplier: idSupplier,
        }

        const result = await Product.save(product);

        res.status(201).json({ message: 'The product was added', product: product })
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
};


exports.deleteProduct = async (req, res, next) => {
    try {
        const [product] = await Product.findById(req.params.id);
        if (product.length === 0) {
            throw new Error(`No se encontró ningún producto con el id ${req.params.id}`);
        }
        const { id: productId, imageUrl } = product[0];

        if (fs.existsSync(imageUrl)) {
            fs.unlinkSync(imageUrl);
        }

        const deleteResponse = await Product.delete(productId);

        res.status(200).json(deleteResponse);
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
};
