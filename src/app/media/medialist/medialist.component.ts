import { Component, EventEmitter, OnInit } from '@angular/core';
import { Group } from 'src/app/classes/group';
import { NotificationType } from 'src/app/notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';
import { VelocityService } from 'src/app/services/velocity.service';

export const medialist_event: EventEmitter<any> = new EventEmitter<any>();

@Component({
  selector: 'app-medialist',
  templateUrl: './medialist.component.html',
  styleUrls: ['./medialist.component.scss']
})
export class MedialistComponent implements OnInit {

  medialists = new Map();
  groups?: any[];

  constructor(private vs: VelocityService, private nf: NotificationService) { }

  ngOnInit(): void {
    this.fetch()

    medialist_event.subscribe({
      next: () => {
        this.fetch()
      }
    })

    this.vs.get_grouplist().then(
      res => {
        this.groups = res.groups;
      }
    ).catch(err => {
      this.nf.send_notification(NotificationType.ERROR, "Could not fetch grouplist.")
    })
  }

  fetch() {
    this.vs.get_user_medialists().then(
      res => {
        this.medialists = res;
    })
  }

  lookup_group_name(gid: number) {
    if(this.groups == undefined) {
      return "N/A";
    }
 
    for(let group of this.groups) {
      if(group.gid == gid) {
        return group.name;
      }
    }
    return "N/A";
  }

  delete_media(mid: number) {
    this.vs.delete_media(mid).then(
      res => {
        this.fetch()
        this.nf.send_notification(NotificationType.SUCCESS, "Media deleted.")
      }
    ).catch(err => {
      this.nf.send_notification(NotificationType.ERROR, "Could not delete media.")
    })
  }
}
