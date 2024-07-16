import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instructor } from '../models/Instructor';
import { catchError, first } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private apiUrl = 'http://localhost:3000/instructors';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) {}

  getInstructors(): Observable<Instructor[]> {
    return this.http
    .get<Instructor[]>(this.apiUrl,{ responseType: "json" })
    .pipe(
      catchError(error => {
        return this.errorHandlerService.handleError<Instructor[]>("getInstructors", [])(error);
      }),
    );
  }

  addInstructor(instructor: any): Observable<Instructor> {
    return this.http.post<Instructor>(this.apiUrl, instructor)
    .pipe(
          catchError(error => {
            return this.errorHandlerService.handleError<Instructor>("addInstructor")(error);
          }),
        );
  }  

  updateInstructor(id: number, instructor: Instructor): Observable<Instructor> {
    return this.http.put<Instructor>(`${this.apiUrl}/${id}`, instructor);
  }

  deleteClass(classId: Pick<Instructor, "id">): Observable<{}> {
    return this.http
    .delete<Instructor>(`${this.apiUrl}/${classId.id}`, this.httpOptions)
    .pipe(
      first(),
      catchError(error => {
        return this.errorHandlerService.handleError<Instructor>("deleteInstructor")(error);
      }),
    )
  }
}
