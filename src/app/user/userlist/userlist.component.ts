import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Group } from 'src/app/classes/group';
import { User } from 'src/app/classes/user';
import { NotificationType } from 'src/app/notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';
import { VelocityService } from 'src/app/services/velocity.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent {

  users: User[ ] = [ ]

  constructor(private vs: VelocityService, private nf: NotificationService) { }

  ngOnInit(): void {
    this.update_list()
  }

  update_list() {
    this.vs.get_userlist().then(
        res => {
          this.users = res.users
      }).catch(
        err => {
          this.nf.send_notification(NotificationType.ERROR, "Could not fetch list of users!");
      }
    )
  }

  delete_user(id: number) {
    this.vs.delete_user(id).then(res => {
      this.nf.send_notification(NotificationType.SUCCESS, "User deleted.")
      this.update_list()
    }).catch(err => {
      this.nf.send_notification(NotificationType.ERROR, "Could not delete user.")
    })
  }
}
