import { Component, OnInit } from '@angular/core';
import { User, VelocityService } from '../services/velocity.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private vs: VelocityService) { }

  users: User[ ] = [ ]

  ngOnInit(): void {
    this.vs.get_userlist().subscribe({
      next: (v) => {
        this.users = v
      }
    })
  }
}
