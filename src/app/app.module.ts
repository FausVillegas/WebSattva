import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './components/products/product-list/product-list.component';
// import { ProductAlertsComponent } from './products/product-alerts/product-alerts.component';
// import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { CartService } from './cart.service';

import { AppComponent } from './app.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { LogInComponent } from './components/log-in/log-in.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    ProductListComponent,
    CartComponent,
    LogInComponent,
    // ProductAlertsComponent,
    // ProductDetailsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'products', component: ProductListComponent },
      // { path: 'product/:productId', component: ProductDetailsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'login', component: LogInComponent },
      // { path: 'shipping', component: ShippingComponent },
    ]),
  ],
  providers: [CartService,LogInComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
