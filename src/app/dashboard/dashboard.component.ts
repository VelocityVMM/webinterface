import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Flowbite } from '../flowbitefix/flowbitefix';
import { NotificationService } from '../services/notification.service';
import { VelocityService } from '../services/velocity.service';
import { AuthService } from '../auth/auth.service';
import { VInfo } from '../log/log';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
@Flowbite()
export class DashboardComponent implements OnInit {

  public dark_mode = false;
  public available_options: string[] = [ ];

  // Reference to the notification ng-template
  @ViewChild('notificationRef', { read: ViewContainerRef, static: true }) vcr!: ViewContainerRef;

  constructor(private as: AuthService, private nf: NotificationService) { }
  
  ngOnInit(): void {
    this.nf.set_notification_template_ref(this.vcr)

    // Check if Darkmode is set.
    if(localStorage.getItem("Theme") == "Dark") {
      VInfo("Restored Theme settings, Darkmode enabled.")
      document.documentElement.classList.add('dark')
      this.dark_mode = true;
    } else {
      VInfo("Restored Theme settings, Darkmode disabled.")
      document.documentElement.classList.remove('dark')
      this.dark_mode = false;
    }

    // TEMP!!!
    this.available_options.push("overview");
    this.available_options.push("users");
    this.available_options.push("groups");
    this.available_options.push("media")



    /*
    this.ls.user_set.subscribe({
      next: () => {
        this.permission_check()
      }
    })
    */

    /*
    // Update the dashboard if permissions change.
    this.vs.permissions_changed.subscribe({
      next: () => {
        this.permission_check()
      }
    })
    */
  }

  async logout() { 
    await this.as.logout()
  }

  toggle_theme() {
    if(this.dark_mode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem("Theme", "Light")
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem("Theme", "Dark")
    }

    this.dark_mode = !this.dark_mode
  }

  permission_check() {
    VInfo("Checking permissions..")

    // Overview is always enabled (for now)
    this.available_options.push("overview");
    this.available_options.push("groups");

    /*
    if(this.ls.get_user()?.has_permissions_global(["velocity.user.create",
                                                    "velocity.user.remove",
                                                    "velocity.user.assign",
                                                    "velocity.user.revoke",
                                                    "velocity.user.list"
                                                  ])) {
      this.available_options.push("users");
    }
    */

    //TODO: TEMP
    this.available_options.push("vm");
    this.available_options.push("media");
  }

  is_enabled(name: string) {
    return true;
    //return this.available_options.includes(name)
  }
}