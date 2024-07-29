import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first, Observable } from 'rxjs';
import { SattvaEvent } from '../models/Event';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { AuthService } from './auth.service';
import { env } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${env.apiUrl}/events`;
  
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService, private authService: AuthService) {}

  getEvents(): Observable<SattvaEvent[]> {
    return this.http.get<SattvaEvent[]>(this.apiUrl,{ responseType: "json" })
    .pipe(
      catchError(error => {
        return this.errorHandlerService.handleError<SattvaEvent[]>("getEvents", [])(error);
      }),
    );
  }

  addEvent(eventData: any): Observable<SattvaEvent> {
    return this.http.post<SattvaEvent>(this.apiUrl, eventData)
    .pipe(
      catchError(error => {
        return this.errorHandlerService.handleError<SattvaEvent>("addEvent")(error);
      }),
    );
  }

  updateEvent(id: number, eventData: any): Observable<SattvaEvent> {
    return this.http.put<SattvaEvent>(`${this.apiUrl}/${id}`, eventData);
  }

  deleteEvent(eventId: Pick<SattvaEvent, "id">): Observable<{}> {
    return this.http
    .delete<SattvaEvent>(`${this.apiUrl}/${eventId.id}`, this.httpOptions)
    .pipe(
      first(),
      catchError(error => {
        return this.errorHandlerService.handleError<SattvaEvent>("deleteEvent")(error);
      }),
    )
  }

  registerAndPay(event: SattvaEvent): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.post<any>(`${this.apiUrl}/events/${event.id}/register-pay`, { userId, price: event.price, title: event.title });
  }  

  registerForEvent(eventId: number): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.post<any>(`${this.apiUrl}/events/${eventId}/register`, { userId }).pipe(
      first(),
      catchError(error => {
        return this.errorHandlerService.handleError<SattvaEvent>("registerForEvent")(error);
      }),
    );
  }
  
  getEventById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
