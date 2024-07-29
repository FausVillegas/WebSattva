import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000';
  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  loadCart(): void {
    this.http.get<any[]>(`${this.apiUrl}/cart/${this.authService.getUserId()}`).subscribe((data: any[]) => {
      this.cartItems.next(data);
    });
  }

  getCartItems(): any[] {
    return this.cartItems.getValue();
  }

  addToCart(product: any, quantity: number): void {
    if(product.stock-quantity >= 0) {
      const item = { userId: this.authService.getUserId(), productId: product.id, quantity };
      this.http.post(`${this.apiUrl}/cart`, item).subscribe(() => {
        alert("Producto agregado al carrito.");
        this.loadCart();
      });
    } else {
      alert(`No hay suficiente stock para agregar ${quantity} de este producto al carrito.`);
    }
  }

  removeItem(index: number): void {
    const cartItems = this.getCartItems();
    const productId = cartItems[index].product_id;
    this.http.delete(`${this.apiUrl}/cart/${this.authService.getUserId()}/${productId}`).subscribe(() => {
      this.loadCart();
    });
  }

  clearCart(): void {
    this.http.delete(`${this.apiUrl}/cart/${this.authService.getUserId()}`).subscribe(() => {
      this.cartItems.next([]);
    });
  }

  getTotalPrice(): number {
    return this.getCartItems().reduce((total, item) => total + item.quantity * item.sale_price, 0);
  }

  getItemsInCart(): number {
    return this.getCartItems().reduce((total, item) => total + item.quantity, 0);
  }

  updateItemQuantity(index: number, quantity: number): void {
    const cartItems = this.getCartItems();
    const product = cartItems[index];
    if (!product) return;
    if(product.stock - quantity >= 0) {
      const updatedItem = { product, quantity };
      this.http.put(`${this.apiUrl}/cart/${this.authService.getUserId()}/${product.product_id}`, updatedItem).subscribe(() => {
        this.loadCart();
      });
    } else {
      alert(`No hay suficiente stock para agregar ${quantity} de este producto al carrito.`);
    }
  }
}