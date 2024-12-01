import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ClassService } from 'src/app/services/class.service';
import { EventService } from 'src/app/services/event.service';
import { SattvaClass } from 'src/app/models/Class';
import { SattvaEvent } from 'src/app/models/Event';
import { AuthService } from 'src/app/services/auth.service';
import initMercadoPago, { MercadoPagoInstance } from '@mercadopago/sdk-react/mercadoPago/initMercadoPago';
import { ClassEventDetailsComponent } from '../class-event/class-event-details/class-event-details.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  apiUrl = environment.apiUrl;
  classes: SattvaClass[] = [];
  events: SattvaEvent[] = [];
  isAdmin = false;
  mail = environment.emailSattva;
  phone = environment.phoneSattva
  
  constructor(private classService: ClassService, private eventService: EventService, private authService: AuthService, private dialog: MatDialog, private router: Router) {}

  navigateToAddInstructor() {
    if (this.isAdmin) {
      this.router.navigate(['/instructors']);
    }
  }

  openEventDetails(data: any): void {
    const dialogRef = this.dialog.open(ClassEventDetailsComponent, {
      width: '500px',
      data: data,
      autoFocus: false,
    });
  }

  ngOnInit(): void {
    this.loadClasses();
    this.loadEvents();
    this.isAdmin = this.authService.isAdmin();
  }

  loadClasses(): void {
    this.classService.getClasses().subscribe(classes => this.classes = classes);
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => this.events = events);
  }

  addClass(classData: SattvaClass): void {
    this.classService.addClass(classData).subscribe(() => this.loadClasses());
  }

  updateClass(classData: SattvaClass): void {
    this.router.navigate(['/edit-class', classData.id]);
  }

  deleteClass(classId: Pick<SattvaClass, "id">): void {
    console.log("Borrando clase: "+classId.id);
    this.classService.deleteClass(classId).subscribe(() => this.loadClasses());
  }

  addEvent(eventData: SattvaEvent): void {
    this.eventService.addEvent(eventData).subscribe(() => this.loadEvents());
  }

  updateEvent(eventData: SattvaEvent): void {
    this.router.navigate(['/edit-event', eventData.id]);
  }

  deleteEvent(eventId: Pick<SattvaEvent, "id">): void {
    console.log("Borrando evento: "+eventId.id);
    this.eventService.deleteEvent(eventId).subscribe(() => this.loadEvents());
  }

  getAuthService(): AuthService {
    return this.authService;
  }
}
