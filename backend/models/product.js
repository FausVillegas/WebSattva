const db = require('../util/database');

module.exports = class Product {
    constructor(title, description, price, category, stock, image){
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.stock = stock;
        this.image = image;
        // this.idSupplier = idSupplier;
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static save(product) {
        return db.execute(
            'INSERT INTO products (title, description, price, category, stock, image) VALUES (?, ?, ?, ?, ?, ?)', 
            [product.title, product.description, product.price, product.category, product.stock, product.image]
        );
    }

    static delete(id) {
        return db.execute('DELETE FROM products WHERE id = ?',[id]);
    }
};