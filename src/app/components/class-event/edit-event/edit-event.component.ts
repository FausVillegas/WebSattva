import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { SattvaEvent } from 'src/app/models/Event';
import { InstructorService } from 'src/app/services/instructor.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  eventData: any = {};
  instructors: any[] = [];
  formattedDateTime: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private instructorService: InstructorService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventService.getEventById(Number(id)).subscribe(data => {
      console.log(data.event_datetime.toString());
      this.eventData = data;
      // this.eventData = this.eventData.event_datetime.toString();
      // if (this.eventData.event_datetime) {
      //   this.eventData.event_datetime = this.formatDateTime(this.eventData.event_datetime);
      // }
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

  // formatDateTime(datetime: string): string {
  //   // Assuming datetime is in ISO format (e.g., "2024-08-05T20:30:00.000Z")
  //   // Convert it to "yyyy-MM-ddThh:mm"
  //   const date = new Date(datetime);
  //   const formattedDate = date.toISOString().slice(0, 16);
  //   return formattedDate;
  // }

  onSave() {
    this.eventService.updateEvent(this.eventData.id, this.eventData).subscribe(() => {
      this.router.navigate(['/']);  // Redirect after save
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
