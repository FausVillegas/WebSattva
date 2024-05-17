import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
//   @ViewChild('register') register: ElementRef | undefined;
//   @ViewChild('login') login: ElementRef | undefined;

//   registerForm: FormGroup;

//  constructor(private formBuilder: FormBuilder,private renderer: Renderer2) {
//     this.registerForm = this.formBuilder.group({
//       fullname: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required]
//     });
//  }
 
//  logInForm(){
//   if(this.register!=null && this.login!=null){
//     this.register.classList.add("hide");
//     this.register.classList.remove("hide");
//   }
//  }
//  singInForm(){
//   if(this.register!=null && this.login!=null){
//     this.renderer.setStyle(this.login.nativeElement, 'display', 'none');
//     this.renderer.setStyle(this.register.nativeElement, 'display', 'block');
//   }
//  }
 title = 'my-app';

 constructor(private el: ElementRef, private renderer: Renderer2) {}

 showRegisterForm() {
    this.renderer.removeClass(this.el.nativeElement.querySelector('.register'), 'hide');
    this.renderer.addClass(this.el.nativeElement.querySelector('.login'), 'hide');
 }

 showLoginForm() {
    this.renderer.removeClass(this.el.nativeElement.querySelector('.login'), 'hide');
    this.renderer.addClass(this.el.nativeElement.querySelector('.register'), 'hide');
 }
}
