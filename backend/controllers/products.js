const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const Product = require('../models/product');

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

    const title = req.body.title; 
    const description = req.body.description; 
    const price = req.body.price; 
    const category = req.body.category; 
    const stock = req.body.stock;
    const image = req.body.image;
    // const idSupplier = req.body.id_supplier;
    
    console.info(req.body);
    // console.info(idSupplier);

    try {
        const product = {
            title: title, 
            description: description,
            price: price, 
            category: category,
            stock: stock,
            image: image,
            // idSupplier: idSupplier,
        }

        const result = await Product.save(product);

        res.status(201).json({ message: 'The product was added' })
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const deleteResponse = await Product.delete(req.params.id);
        res.status(200).json(deleteResponse);
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
};