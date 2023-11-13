import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Try to restore an old Session
    // this.ls.restore_session()

    // Enable Flowbite JS
    initFlowbite();
  }

  title = 'hyper';
}
