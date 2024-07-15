import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from 'src/app/models/Event';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.css']
})
export class EventAddComponent {
  newEvent = { title: '', description: '', imageUrl: '', dateTime: new Date(), instructor_id: 0, price: 0};
  selectedFile: File | undefined;

  constructor(private eventService: EventService, private router: Router) { }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
  addEvent(): void {
    const formData = new FormData();
    formData.append('title', this.newEvent.title);
    formData.append('description', this.newEvent.description);
    formData.append('dateTime', this.newEvent.dateTime.toString());
    formData.append('price', this.newEvent.price.toString());
    formData.append('instructor_id', this.newEvent.instructor_id.toString());
    if(this.selectedFile)
      formData.append('imageUrl', this.selectedFile);
    
    this.eventService.addEvent(formData).subscribe(() => {
            this.router.navigate(['/addEvent']);
          });
  }
}
