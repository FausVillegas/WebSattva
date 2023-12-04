import { Component } from '@angular/core';
import { CartService } from 'src/app/cart.service';
import { ProductsData } from '../api-data';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  products: any;

  constructor(private ProductsData: ProductsData, private cartService: CartService) {
    this.ProductsData.getProducts().subscribe(data => {
      this.products = data;
    });
  }
  
  share(product : any) {
    window.alert('The product has been shared!');
    this.cartService.addToCart(product);
  }
}

