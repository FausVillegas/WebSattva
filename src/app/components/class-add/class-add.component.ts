// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { ClassService } from '../../services/class.service';
// import { Class } from 'src/app/models/Class';

// @Component({
//   selector: 'app-class-add',
//   templateUrl: './class-add.component.html',
//   styleUrls: ['./class-add.component.css']
// })
// export class ClassAddComponent {
//   newClass: Class = {id: 0, title: '', description: '', imageUrl: '', instructor_id: 0};

//   constructor(private classService: ClassService, private router: Router) { }

//   addClass(): void {
//     // this.classService.addClass(this.newClass);
//     this.classService.addClass(this.newClass).subscribe(() => {
//       this.router.navigate(['/addClass']);
//     });
//   }
// }

import { Component } from '@angular/core';
import { ClassService } from 'src/app/services/class.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-class-add',
  templateUrl: './class-add.component.html',
  styleUrls: ['./class-add.component.css']
})
export class ClassAddComponent {
  newClass = { title: '', description: '', monthlyFee: 0, instructor_id: 0 };
  selectedFile: File | undefined;

  constructor(private classService: ClassService, private http: HttpClient, private router: Router) {}

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addClass() {
    const formData = new FormData();
    formData.append('title', this.newClass.title);
    formData.append('description', this.newClass.description);
    formData.append('monthlyFee', this.newClass.monthlyFee.toString());
    formData.append('instructor_id', this.newClass.instructor_id.toString());
    if(this.selectedFile)
      formData.append('imageUrl', this.selectedFile);
    
    this.classService.addClass(formData).subscribe(() => {
            this.router.navigate(['/addClass']);
          });
  }
}
