declare var google: any;

import { Component, Renderer2, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Token } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
   selector: 'app-log-in',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule],
   templateUrl: './log-in.component.html',
   styleUrls: ['./log-in.component.css'],
})
export class LogInComponent implements OnInit {
   signupForm: FormGroup;
   loginForm: FormGroup;
   title = 'my-app';
   private router = inject(Router);

   ngOnInit(): void {
      // Verificar si google.accounts está disponible antes de usarlo
      if (google && google.accounts) {
         google.accounts.id.initialize({
            client_id: '449618549015-h89mnko150rl875h68dt6qn4l0dq2nhi.apps.googleusercontent.com',
            callback: (resp: any) => this.handleGoogleLogin(resp)
         });

         google.accounts.id.renderButton(
            document.getElementsByClassName("google-btn")[0],
            {
               theme: 'filled_blue',
               size: 'large',
               shape: 'rectangle',
               width: 350
            }
         );
      }
   }

   private decodeToken(token: string){
      return JSON.parse(atob(token.split(".")[1]));
   }

   handleGoogleLogin(response: any) {
      if (response) {
          this.authService.googleLogin(response.credential).subscribe(user => {
              sessionStorage.setItem("loggedInUser", JSON.stringify(user));
              this.router.navigate(['profile']);
          });
      }
  }
  

   // handleGoogleLogin(response: any) {
   //    if(response){
   //       //decode the token
   //       const payload = this.decodeToken(response.credential);
   //       //store in session
   //       sessionStorage.setItem("loggedInUser", JSON.stringify(payload));
   //       //navigate to home/browesr
   //       this.router.navigate(['profile']);
   //    }
   // }

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
      this.router.navigate(['profile']);
   }

   login(): void {
      console.log(this.loginForm.value);
      this.authService
         .login(this.loginForm.value.email, this.loginForm.value.password)
         .subscribe();
      this.router.navigate(['profile']);
   }

   googleLogin(): void {
      console.log(JSON.parse(sessionStorage.getItem("loggedInUser")!).name);
      this.authService
         .googleLogin(JSON.parse(sessionStorage.getItem("loggedInUser")!))
         .subscribe();
      this.router.navigate(['profile']);
   }
}
