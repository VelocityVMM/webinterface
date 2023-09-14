import { Component, OnInit } from '@angular/core';
import { User, VelocityService } from '../services/velocity.service';
import { Flowbite } from '../flowbitefix/flowbitefix';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../notification/notification.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
@Flowbite()
export class UsersComponent implements OnInit {

  constructor(private vs: VelocityService, private nf: NotificationService) { }

  users: User[ ] = [ ]

  ngOnInit(): void {
    this.update_list()
  }

  update_list() {
    this.vs.get_userlist().subscribe({
      next: (v) => {
        this.users = v
      }
    })
  }

  delete_user(id: number) {
    this.vs.delete_user(id).subscribe({
      next: (v) => {
        this.update_list()
        this.nf.send_notification(NotificationType.SUCCESS, "User deleted.")
      }, error: (e) => {
        this.nf.send_notification(NotificationType.ERROR, "Could not delete user.")
      }
    })
  }

  create_user(f: NgForm) {
    // Really ugly hack, but this seems to be a common issue..
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    this.vs.create_user(f.value.username, f.value.password).subscribe({
      next: (v) => {
        this.nf.send_notification(NotificationType.SUCCESS, `User '${v.name}' created with uid ${v.uid}.`)
        this.update_list()
      }, error: (e) => {
        this.nf.send_notification(NotificationType.ERROR, e.error.message)
        this.update_list()
      }
    })
    f.reset()
  }
}
