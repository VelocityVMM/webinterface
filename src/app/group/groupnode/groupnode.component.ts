import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Group } from 'src/app/classes/group';
import { Flowbite } from 'src/app/flowbitefix/flowbitefix';
import { NotificationType } from 'src/app/notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';
import { VelocityService } from 'src/app/services/velocity.service';

@Component({
  selector: 'app-groupnode',
  templateUrl: './groupnode.component.html',
  styleUrls: ['./groupnode.component.scss']
})
@Flowbite()
export class GroupnodeComponent {

  @Input() group?: Group;
  @Output() tree_update: EventEmitter<any> = new EventEmitter();

  constructor(private vs: VelocityService, private nf: NotificationService) { }

  add_subgroup(form: any) {
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    this.vs.add_subgroup(form.form.value.groupname, this.group?.gid!).then(
      res => {
        this.tree_update.emit()
        this.nf.send_notification(NotificationType.SUCCESS, "Group created.");
      }
    ).catch(err => {
      this.nf.send_notification(NotificationType.ERROR, "Could not create group.");
    })

    form.reset()
  }

  delete_group() {
    this.vs.delete_group(this.group?.gid!).then(
      res => {
        this.nf.send_notification(NotificationType.SUCCESS, "Group deleted!")
        this.tree_update.emit()
    }).catch(
      err => {
        this.nf.send_notification(NotificationType.ERROR, "Could not delete group.")
      }
    )
  }

  /*
  * Kicks the user created event up a level
  */
  kick_up() {
    this.tree_update.emit()
  }
}
