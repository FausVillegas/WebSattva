import { Component } from '@angular/core';
import { InstructorService } from 'src/app/services/instructor.service';  // Asegúrate de tener un servicio para manejar la lógica de negocio

@Component({
  selector: 'app-add-instructor',
  templateUrl: './add-instructor.component.html',
  styleUrls: ['./add-instructor.component.css']
})
export class AddInstructorComponent {
  instructor = {
    firstName: '',
    lastName: '',
    email: '',
    dni: '',
    salary: 0
  };

  constructor(private instructorService: InstructorService) {}

  onSubmit() {
    if (this.validateForm()) {
      this.instructorService.addInstructor(this.instructor).subscribe((response: any) => {
        console.log(response);
      });
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }

  validateForm() {
    return this.instructor.firstName && this.instructor.lastName && this.instructor.email && this.instructor.dni && this.instructor.salary;
  }
}
