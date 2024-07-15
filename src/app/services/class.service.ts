import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first, Observable } from 'rxjs';
import { Class } from '../models/Class';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = 'http://localhost:3000/classes';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) {}

  getClasses(): Observable<Class[]> {
    return this.http
    .get<Class[]>(this.apiUrl,{ responseType: "json" })
    .pipe(
      catchError(error => {
        return this.errorHandlerService.handleError<Class[]>("getClasses", [])(error);
      }),
    );
  }

  addClass(classData: any): Observable<Class> {
    return this.http.post<Class>(this.apiUrl, classData)
    .pipe(
          catchError(error => {
            return this.errorHandlerService.handleError<Class>("addClass")(error);
          }),
        );
  }  

  updateClass(id: number, classData: Class): Observable<Class> {
    return this.http.put<Class>(`${this.apiUrl}/${id}`, classData);
  }

  deleteClass(classId: Pick<Class, "id">): Observable<{}> {
    return this.http
    .delete<Class>(`${this.apiUrl}/${classId.id}`, this.httpOptions)
    .pipe(
      first(),
      catchError(error => {
        return this.errorHandlerService.handleError<Class>("deleteClass")(error);
      }),
    )
  }
}
