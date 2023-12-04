import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './products/product-list/product-list.component';
// import { ProductAlertsComponent } from './products/product-alerts/product-alerts.component';
// import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { CartService } from './cart.service';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ApiDataComponent } from './api-data/api-data.component';

@NgModule({
  declarations: [
    AppComponent,
    ApiDataComponent,
    TopBarComponent,
    ProductListComponent,
    CartComponent,
    // ProductAlertsComponent,
    // ProductDetailsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: ProductListComponent },
      // { path: 'product/:productId', component: ProductDetailsComponent },
      { path: 'cart', component: CartComponent },
      // { path: 'shipping', component: ShippingComponent },
    ]),
  ],
  providers: [CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
