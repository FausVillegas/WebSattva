import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { SattvaEvent } from 'src/app/models/Event';
import { InstructorService } from 'src/app/services/instructor.service';
import { environment } from 'src/environments/environment';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  eventData: any = {};
  apiUrl = environment.apiUrl;
  selectedFile: File | undefined;
  instructors: any[] = [];
  formattedDateTime: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private instructorService: InstructorService,
    private filesService: FilesService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventService.getEventById(Number(id)).subscribe(data => {
      this.eventData = data;
    });
    this.instructorService.getInstructors().subscribe(data => {
      this.instructors = data;
    });
  }

  onDateTimeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;

    // Only update eventData.event_datetime if the newValue is not empty
    if (newValue) {
      this.eventData.event_datetime = newValue;
    }
    console.log(this.eventData.event_datetime);
  }

  async onSave() {
    if (this.eventData.price < 0) {
      alert("El precio del evento no puede ser negativo.");
      return;
    }

    const formData = new FormData();
    formData.append('id', this.eventData.id);
    formData.append('title', this.eventData.title);
    formData.append('description', this.eventData.description);
    formData.append('price', this.eventData.price.toString());
    formData.append('instructor_id', this.eventData.instructor_id?.toString());
    formData.append('event_datetime', this.eventData.event_datetime);

    if (this.selectedFile) {
      const imageUrl = await this.filesService.uploadImage(this.selectedFile);
      formData.append('imageUrl', imageUrl.url);
    }

    this.eventService.updateEvent(this.eventData.id, formData).subscribe(() => {
      this.router.navigate(['/']);  // Redirect after save
    });
  }
  
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
