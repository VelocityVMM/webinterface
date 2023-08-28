import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { VelocityService } from '../services/velocity.service';
import { LogService } from '../services/log.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public dark_mode = false;
  public available_options: string[] = [ ];

  constructor(private vlog: LogService, private ls: LoginService, 
              private vs: VelocityService, private router: Router) { }

  ngOnInit(): void {
    if(window.location.pathname == "/dashboard/" || window.location.pathname == "/dashboard") {
      this.router.navigate(["/dashboard/overview"])
    }
    this.ls.user_set.subscribe({
      next: () => {
        this.permission_check()
      }
    })
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

  toggle_theme() {
    this.dark_mode = !this.dark_mode

    if(this.dark_mode) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  permission_check() {
    this.vlog.VInfo("Checking permissions..", "PERM")

    // Overview is always enabled (for now)
    this.available_options.push("overview");

    if(this.ls.get_user()?.has_permissions_global(["velocity.user.create",
                                                    "velocity.user.remove",
                                                    "velocity.user.assign",
                                                    "velocity.user.revoke",
                                                    "velocity.user.list"
                                                  ])) {
      this.available_options.push("users");
    }

  }

  is_enabled(name: string) {
    return this.available_options.includes(name)
  }
}