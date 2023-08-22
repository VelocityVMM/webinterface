import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public darkMode = false;

  constructor(private ls: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(["/dashboard/overview"])
  }

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

  toggleTheme() {
    this.darkMode = !this.darkMode

    if(this.darkMode) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }
}
