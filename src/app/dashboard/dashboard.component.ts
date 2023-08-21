import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private ls: LoginService, private router: Router) { }

  logout() { 
    this.ls.logout().subscribe({
      next: (v) => {
        this.router.navigate(["/login"])
      },
      error: (e) => {
        this.router.navigate(["/login"])
      }
    })
  }

}
