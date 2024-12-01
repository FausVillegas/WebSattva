import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  uploadImage(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    return lastValueFrom(this.http.post(`${environment.apiUrl}/api/upload`, formData));
  }
}
