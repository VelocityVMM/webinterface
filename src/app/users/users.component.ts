import { Component, OnInit } from '@angular/core';
import { VelocityService } from '../services/velocity.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private vs: VelocityService) { }

  ngOnInit(): void {

  }

}
