import { validationResult } from 'express-validator';

import bcrypt from 'bcryptjs';
import { existsSync, unlinkSync } from 'fs';
import Product from '../models/product.js';
import path from 'path';

export async function fetchAll(req, res, next) {
    try {
        const [allProducts] = await Product.fetchAll();
        res.status(200).json(allProducts);
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
}

export async function postProduct(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return console.error("Error "+errors);
    }
    
    const { title, description, sale_price, category, stock } = req.body;
    const image_url = req.file.path;

    // console.info("Controllers/Products.js"+req.body);
    // console.info(idSupplier);

    try {
        const product = {
            title: title, 
            description: description,
            sale_price: sale_price, 
            category: category,
            stock: stock,
            image_url: image_url,
            // idSupplier: idSupplier,
        }

        const result = await Product.save(product);

        res.status(201).json({ message: 'The product was added', product: product })
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
}


export async function deleteProduct(req, res, next) {
    console.log("Borrando producto "+req.params.id)
    try {
        const [product] = await Product.findById(req.params.id);
        if (product.length === 0) {
            throw new Error(`No se encontró ningún producto con el id ${req.params.id}`);
        }
        const { id: productId, image_url } = product[0];

        if (existsSync(image_url)) {
            unlinkSync(image_url);
        }

        const deleteResponse = await Product.delete(productId);

        res.status(200).json(deleteResponse);
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
}

export async function getProductById(req, res, next) {
    try {
      const [product] = await Product.findById(req.params.id);
      if (product.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product[0]);
    } catch (error) {
      next(error);
    }
  }

import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export const createPreference = async (req, res) => {
  try {
    const { items, userId } = req.body;
    
    // console.log("ITEMS:", userId);
    // items.forEach(item => console.log(item.sale_price));

    const body = {
      items: items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: Number(item.sale_price),
        currency_id: 'ARS'
      })),
      back_urls: {
        success: 'https://www.google.com/',
        failure: 'https://www.google.com/',
        pending: 'https://www.google.com/'
      },
      auto_return: 'approved',
      metadata: { userId: userId, items: items },
      notification_url: "https://fc47-181-170-144-157.ngrok-free.app/products/webhook"
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });
    // console.log("Preference created:", result);
    res.json({ id: result.id });
  } catch (error) {
    console.log("Error:", error);
    console.error("Error creating preference:", error);
    res.status(500).json({ error: 'Error creating preference' });
  }
};

export const handleWebhook = async (req, res) => {
  const paymentId = req.query.id;
  try {
      const respose = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
          }
      });

      if(respose.ok) {
          const data = await respose.json();
          const { items, user_id } = data.metadata;
          const transaction_amount = data.transaction_amount;
          
          const [orderResult] = await Product.insertOrder(user_id, transaction_amount);
          
          const newOrderId = orderResult.insertId;
          
          for (const item of items) {
            const productId = item.product_id;
            const quantity = item.quantity;
            await Product.insertOrderProductRelation(newOrderId, productId, quantity);
          }
      }

      res.sendStatus(200);
  } catch(error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Error processing webhook' });
  }
};


