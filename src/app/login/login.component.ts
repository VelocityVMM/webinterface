import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  show_login_dialogue: boolean = true;
  show_error: boolean = false;

  constructor(private as: AuthService, private router: Router) { }

  onSubmit(f: NgForm) {
    this.show_error = false;

    this.as.login(f.value.username, f.value.password).then(success => {
      if(success) {
        this.show_login_dialogue = false;
        this.show_error = false;

        // Move to dashboard
        this.router.navigate(["/dashboard"])
      } else {
        this.show_error = true;
      }
    })
  }
}
