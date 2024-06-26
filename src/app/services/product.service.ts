import { Injectable, Type } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, first } from 'rxjs';
import { catchError } from 'rxjs';

import { Product } from '../models/Product';
import { User } from '../models/User';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = "http://localhost:3000/products"

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  fetchAll(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.url, { responseType: "json" })
      .pipe(
        catchError(error => {
          return this.errorHandlerService.handleError<Product[]>("fetchAll", [])(error);
        }),
      );
  }

  createProduct(formData: Partial<Product>): Observable<Product> {
    return this.http
    .post<Product>(this.url, { title: formData.title, description: formData.description, price: formData.price, category: formData.category, stock: formData.stock, image: formData.image }, this.httpOptions)
    .pipe(
      catchError(error => {
        return this.errorHandlerService.handleError<Product>("createProduct")(error);
      }),
    );
  }

  deleteProduct(productId: Pick<Product, "id">): Observable<{}> {
    return this.http
    .delete<Product>(`${this.url}/${productId.id}`, this.httpOptions)
    .pipe(
      first(),
      catchError(error => {
        return this.errorHandlerService.handleError<Product>("deleteProduct")(error);
      }),
    )
  }
}
