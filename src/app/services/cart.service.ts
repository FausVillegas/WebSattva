import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  constructor(private http: HttpClient) {}

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
    let item = this.cartItems.find(item => item.product.id === product.id);
    if (!item) {
      item = { product: product, quantity: 0 };
      this.cartItems.push(item);
    }
    item.quantity++;
  }

  addToCartQuatity(product: any, quantity: number) {
    let item = this.cartItems.find(item => item.product.id === product.id);
    if (!item) {
      item = { product: product, quantity: 0 };
      this.cartItems.push(item);
    }
    item.quantity += quantity;
  }

  getCartItems() {
    return this.cartItems;
  }
  
  get totalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0);
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
  }
}
