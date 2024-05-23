import { Component, Renderer2, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit{
//   registerForm: FormGroup;

//  constructor(private formBuilder: FormBuilder,private renderer: Renderer2) {
//     this.registerForm = this.formBuilder.group({
//       fullname: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required]
//     });
//  }

   signupForm: FormGroup;
   title = 'my-app';

 constructor(private el: ElementRef, private renderer: Renderer2) {
   this.signupForm = this.createFormGroup()
 }

 showRegisterForm() {
    this.renderer.removeClass(this.el.nativeElement.querySelector('.signup'), 'hide');
    this.renderer.addClass(this.el.nativeElement.querySelector('.login'), 'hide');
 }

 showLoginForm() {
    this.renderer.removeClass(this.el.nativeElement.querySelector('.login'), 'hide');
    this.renderer.addClass(this.el.nativeElement.querySelector('.signup'), 'hide');
 }

 ngOnInit(): void {
    this.signupForm = this.createFormGroup();
 }

 createFormGroup(): FormGroup {
   return new FormGroup({
      fullname: new FormControl("", [Validators.required, Validators.minLength(2)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(5)]),
 });
}

 signup(): void {
      console.log(this.signupForm.value);
 }
}
