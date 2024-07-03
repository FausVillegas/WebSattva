import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  auth = inject(AuthService);
  name: string | undefined;
  email: string | undefined;
  loggedInUser = sessionStorage.getItem("loggedInUser");
  constructor() {
    if(this.loggedInUser){
      this.name = JSON.parse(this.loggedInUser!).name;
      this.email = JSON.parse(this.loggedInUser!).email;
    }
  }
  
  logout(){
    this.auth.logout();

  }
}
