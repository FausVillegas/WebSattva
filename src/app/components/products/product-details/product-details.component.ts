import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsData } from '../../../api-data-products/api-data';
import { ProductListComponent } from '../product-list/product-list.component';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  products: any = getProducts();
  
  constructor(private route: ActivatedRoute, private cartService: CartService) {
  }

  ngOnInit(): void {
    // se ejecuta cuando inicia
    //obtener el id del producto de la ruta
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = Number(routeParams.get('productId'));

    //encontrar el producto de ese id de la ruta
    this.product = this.products.find((product: { id: number; }) => product.id === productIdFromRoute);
  }

  //agregar productos al carrito
  addToCart(product: ProductsData){
    this.cartService.addToCart(product);
    window.alert('Your product has been added to the cart');
  }
}
function getProducts(): any {
    throw new Error('Function not implemented.');
}

