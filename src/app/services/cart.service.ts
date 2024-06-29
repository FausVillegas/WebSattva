import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // items: ProductsData[] = []; //articulos del carro

  constructor(private http: HttpClient) {}
  
  //métodos del carrito
  // addToCart(product: ProductsData) {
  //   this.items.push(product);
  // }

  // getItems() {
  //   return this.items;
  // }

  clearCart() {
    this.cartItems = [];
    return this.cartItems;
  }
  
  //peticion get http precios de envío
  getShipingPrices() {
    return this.http.get<{ type: string; price: number }[]>(
      '/assets/shipping.json'
    );
  }

  cartItems:any[] = []; 

  addToCart(product: any) {
    // let item = this.cartItems.find(item => item.product.id === product.id);
    // if (!item) {
    //   item = { product: product, quantity: 0 };
    //   this.cartItems.push(item);
    // }
    // item.quantity++;
    this.cartItems.push(product);
  }

  getCartItems() {
    return this.cartItems;
  }
  
  get totalPrice(): number {
    // return this.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
  }
}
