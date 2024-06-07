import { Component, Renderer2, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit{
   signupForm: FormGroup;
   loginForm: FormGroup;
   title = 'my-app';

 constructor(private el: ElementRef, private renderer: Renderer2, private authService: AuthService) {
   this.signupForm = this.createFormGroupSignup();
   this.loginForm = this.createFormGroupLogin();
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
 }

 createFormGroupSignup(): FormGroup {
   return new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(2)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(5)]),
 });
}
createFormGroupLogin(): FormGroup {
   return new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(5)]),
 });
}

 signup(): void {
   console.log(this.signupForm.value);
      this.authService
         .signup(this.signupForm.value)
         .subscribe((msg) => console.log(msg));
 }

 login(): void {
   console.log(this.loginForm.value);
   this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe();
 }
}
