import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationType } from 'src/app/notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';
import { VelocityService } from 'src/app/services/velocity.service';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})
export class CreateuserComponent {

  // User created Event
  @Output() user_created: EventEmitter<any> = new EventEmitter();

  constructor(private nf: NotificationService, private vs: VelocityService) { }

  create_user(f: NgForm) {
    // Really ugly hack, but this seems to be a common issue..
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    this.vs.create_user(f.value.username, f.value.password).then(
      res => {
        this.nf.send_notification(NotificationType.SUCCESS, `User '${res.name}' created with uid ${res.uid}.`)
        this.user_created.emit();
    }).catch(
      err => {
        this.nf.send_notification(NotificationType.ERROR, err.error.message)
      }
    )
    f.reset()
  }

}
