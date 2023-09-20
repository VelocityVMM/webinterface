import { Component, Input, OnInit } from '@angular/core';
import { Group } from '../classes/group';
import { VelocityService } from '../services/velocity.service';
import { Flowbite } from '../flowbitefix/flowbitefix';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../notification/notification.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
@Flowbite()
export class TreeNodeComponent {

  @Input() node?: Group;
  public active: boolean = true;

  constructor(private vs: VelocityService, private nf: NotificationService) { }

  add_node(form: NgForm) {
    // Really ugly hack, but this seems to be a common issue..
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    const groupname = form.form.value.groupname
    this.vs.add_subgroup(groupname, this.node?.gid ?? 0).subscribe({
      next: (v) => {
        this.vs.group_tree_changed.emit('tree_changed')
        this.nf.send_notification(NotificationType.SUCCESS, "Group added.")
      }, error: (e) => {
        this.nf.send_notification(NotificationType.ERROR, e.error.message ?? "Could not add group.")
      }
    })

    form.reset()
  }

  delete_node() {
    this.vs.delete_group(this.node?.gid ?? 0).subscribe({
      next: (v) => {
        this.vs.group_tree_changed.emit('tree_changed')
        this.nf.send_notification(NotificationType.SUCCESS, "Group deleted.")
      }, error: (e) => {
        this.nf.send_notification(NotificationType.ERROR, e.error.message ?? "Could not delete group.")
      }
    })
  }
}
