import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ClassEventDetailsComponent } from '../class-event/class-event-details/class-event-details.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'app-user-registrations',
  templateUrl: './user-registrations.component.html',
  styleUrls: ['./user-registrations.component.css']
})
export class UserRegistrationsComponent implements OnInit{
  events: any[] = [];
  classes: any[] = [];
  classesSchedules: any[] = [];

  apiUrl = environment.apiUrl;

  constructor(private authService: AuthService, private dialog: MatDialog, private classService: ClassService) {}

  ngOnInit(): void {
    this.authService.getUserRegistrations().subscribe((data) => {
      this.events = data.events;
      this.classes = data.classes;
      this.classes.forEach(element => {
        this.classService.getClassById(Number(element.id)).subscribe(classData => {
          console.log(classData);
          this.classesSchedules[element.id] = classData.classSchedules;
        });
      });
    });
  }

  openEventDetails(data: any): void {
    const dialogRef = this.dialog.open(ClassEventDetailsComponent, {
      width: '500px',
      data: data,
      autoFocus: false,
    });
  }
}
