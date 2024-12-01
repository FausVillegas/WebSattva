import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Instructor } from "src/app/models/Instructor";
import { ClassService } from "src/app/services/class.service";
import { FilesService } from "src/app/services/files.service";
import { InstructorService } from "src/app/services/instructor.service";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-edit-class',
  templateUrl: './edit-class.component.html',
  styleUrls: ['./edit-class.component.css']
})
export class EditClassComponent implements OnInit {
  classData: any = {};
  apiUrl = environment.apiUrl;
  selectedFile: File | undefined;
  instructors: Instructor[] = [];
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private router: Router,
    private instructorService: InstructorService,
    private filesService: FilesService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.classService.getClassById(Number(id)).subscribe(data => {
      this.classData = data.classData;
      this.classData.schedules = data.classSchedules;
    });
    this.instructorService.getInstructors().subscribe(data => {
      this.instructors = data;
    });
  }

  async onSave() {
    if (this.classData.monthly_fee < 0) {
      alert("La cuota mensual no puede ser negativa.");
      return;
    }
    const formData = new FormData();
    formData.append('id', this.classData.id);
    formData.append('title', this.classData.title);
    formData.append('description', this.classData.description);
    formData.append('monthly_fee', this.classData.monthly_fee.toString());
    formData.append('instructor_id', this.classData.instructor_id.toString());
    formData.append('schedules', JSON.stringify(this.classData.schedules));
    
    if (this.selectedFile) {
      const imageUrl = await this.filesService.uploadImage(this.selectedFile);
      formData.append('imageUrl', imageUrl.url);
    }
  
    this.classService.updateClass(this.classData.id, formData).subscribe(() => {
      this.router.navigate(['/']);
    });
  }  

  cancel() {
    this.router.navigate(['/']); 
  }

  addSchedule() {
    this.classData.schedules.push({ day_of_week: '', time: '' });
  }

  removeSchedule(index: number) {
    this.classData.schedules.splice(index, 1);
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }
  
}
