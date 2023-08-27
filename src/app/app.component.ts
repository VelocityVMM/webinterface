import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private ls: LoginService, private router: Router) { }

  ngOnInit(): void {
    // Try to restore an old Session
    this.ls.restore_session()

    // Enable Flowbite JS
    initFlowbite();

    if(!this.ls.logged_in()) {
      this.router.navigate(["/login"])
    } else {
      // No target -> move to overview
      if(window.location.pathname == "/") {
        this.router.navigate(["/dashboard/overview"])
      }
    }
  }

  login_check() {
    return this.ls.logged_in()
  }

  title = 'webinterface';
}
