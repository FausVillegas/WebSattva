import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CartService } from 'src/app/cart.service';
import { ProductsData } from '../../../api-data-products/api-data';

import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';

import { Product } from 'src/app/models/Product';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit{
  products: any;

  products$!: Observable<Product[]>;
  userId!: Pick<User, "id">;

  constructor(private ProductsData: ProductsData, private cartService: CartService, private productService: ProductService, private authService: AuthService) {
    this.ProductsData.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  ngOnInit(): void {
    this.products$ = this.fetchAll();
    this.userId = this.authService.userId;
  }

  fetchAll(): Observable<Product[]> {
    return this.productService.fetchAll();
  }
  
  share(product : any) {
    window.alert('The product has been shared!');
    this.cartService.addToCart(product);
  }

  createProduct(): void {
    this.products$ = this.fetchAll();
  }

  delete(productId: Pick<Product, "id">): void {
    console.log("Borrando producto: "+productId.id);
    this.productService.deleteProduct(productId).subscribe(() => (this.products$ = this.fetchAll()));
  }
}

