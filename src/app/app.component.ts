import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {



  constructor(private ls: LoginService, private router: Router) { }

  ngOnInit(): void {
    if(!this.ls.logged_in()) {
      this.router.navigate(["/login"])
    }
  }

  login_check() {
    return this.ls.logged_in()
  }

  title = 'webinterface';
}
