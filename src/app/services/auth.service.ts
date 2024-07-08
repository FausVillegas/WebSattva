declare var google: any;
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';

import { User } from '../models/User';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:3000/auth"

  userId!: Pick<User, "id">;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(
    private http: HttpClient, 
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) { }

  signup(user: Omit<User,"id">): Observable<User> {
    return this.http
      .post<User>(`${this.url}/signup`, user, this.httpOptions)
      .pipe(
        first(),
        catchError(error => {
          console.error('Signup error', error);
          return this.errorHandlerService.handleError<User>("signup")(error);
        }),
      );
  }

  login(email: Pick<User,"email">, password: Pick<User,"password">): Observable<{ token: string, userId: Pick<User,"id"> }> {    
    return this.http
    .post<{ token: string, userId: Pick<User,"id">, role: string }>(`${this.url}/login`, { email, password }, this.httpOptions)
      .pipe(
        first(),
        tap((tokenObject: { token: string, userId: Pick<User,"id">, role: string }) => {
          this.userId = tokenObject.userId;
          localStorage.setItem("token", tokenObject.token);
          localStorage.setItem("role", tokenObject.role);
          this.router.navigate(["products"]);
        }),
        catchError(this.errorHandlerService.handleError<{ token: string, userId: Pick<User,"id">, role: string }>("login"))
      );
  }

  sendEmailResetPassword(email: Pick<User, "email">): Observable<any> {
    console.log("Se ejecuta sendEmailResetPassword auth.service.ts: ", email);
    return this.http
      .post(`${this.url}/reset-password-request`, email, this.httpOptions)
      .pipe(
        first(),
        catchError(error => {
          console.error('sendEmailResetPassword', error);
          return this.errorHandlerService.handleError<{ email: string }>("sendEmailResetPassword")(error);
        }),
      );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http
      .post(`${this.url}/reset-password`, { token, newPassword }, this.httpOptions)
        .pipe(
          first(),
          catchError(error => {
            console.error('Error resetting password:', error);
            return this.errorHandlerService.handleError<{ email: string }>("resetPassword")(error);
          }),
        );
  }


  googleLogin(token: string): Observable<User> {
    return this.http.post<User>(`${this.url}/google-login`, { token }, this.httpOptions)
        .pipe(
            first(),
            tap(user => {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                this.router.navigate(['profile']);
            }),
            catchError(this.errorHandlerService.handleError<User>("googleLogin"))
        );
  }

  logout(): void {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    google.accounts.id.disableAutoSelect();
    localStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!(localStorage.getItem('token') || sessionStorage.getItem('loggedInUser'));
  }


  isAdmin(): boolean {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if(loggedInUser){
      return JSON.parse(loggedInUser!).role === "admin";
    } 
    return localStorage.getItem('role') === "admin";
  }
}
