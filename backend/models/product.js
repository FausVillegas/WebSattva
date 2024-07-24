import db from '../util/database.js';

export default class Product {
    constructor(title, description, sale_price, category, stock, image_url){
        this.title = title;
        this.description = description;s
        this.sale_price = sale_price;
        this.category = category;
        this.stock = stock;
        this.image_url = image_url;
        // this.idSupplier = idSupplier;
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static save(product) {
        return db.execute(
            'INSERT INTO products (title, description, sale_price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)', 
            [product.title, product.description, product.sale_price, product.category, product.stock, product.image_url]
        );
    }

    static delete(id) {
        return db.execute('DELETE FROM products WHERE id = ?',[id]);
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE id = ?',[id]);
    }

    static insertOrder(userId, totalValue) {
        return db.execute('INSERT INTO Orders (user_id, order_date, total_value) VALUES (?, NOW(), ?)', [userId, totalValue]);
    }

    static insertOrderProductRelation(newOrderId, productId, quantity) {
        return db.execute('INSERT INTO OrderProduct (order_id, product_id, quantity) VALUES (?, ?, ?)', [newOrderId, productId, quantity]);
    }
};