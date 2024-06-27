const db = require('../util/database');

module.exports = class Product {
    constructor(title, description, price, category, stock, imageUrl){
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.stock = stock;
        this.imageUrl = imageUrl;
        // this.idSupplier = idSupplier;
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static save(product) {
        return db.execute(
            'INSERT INTO products (title, description, price, category, stock, imageUrl) VALUES (?, ?, ?, ?, ?, ?)', 
            [product.title, product.description, product.price, product.category, product.stock, product.imageUrl]
        );
    }

    static delete(id) {
        return db.execute('DELETE FROM products WHERE id = ?',[id]);
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE id = ?',[id]);
    }
};