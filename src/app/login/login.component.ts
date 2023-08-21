import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  showLogin: boolean = true;
  showError: boolean = false;

  constructor(private ls: LoginService, private router: Router) { }
  
  ngOnInit(): void {
    if(this.ls.logged_in()) {
      this.router.navigate(["/dashboard"])
    }
  }

  onSubmit(f: NgForm) {
    this.showLogin = false;
    this.showError = false;

    this.ls.login(f.value).subscribe({
      next: (v) => {
        this.router.navigate(["/dashboard"])
      },
      error: (e) => {
        this.showLogin = true;
        this.showError = true;
      },
      complete: () => { }
    })
  }
}
