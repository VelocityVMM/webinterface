import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Pool } from 'src/app/classes/media';
import { NotificationType } from 'src/app/notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';
import { VelocityService } from 'src/app/services/velocity.service';
import { medialist_event } from 'src/app/media/medialist/medialist.component';

export enum Step {
  STEP_ERROR_NO_MP = -1,
  STEP_SET_OPTIONS = 0,
  STEP_CREATING = 1,
}

@Component({
  selector: 'app-mediacreate',
  templateUrl: './mediacreate.component.html',
  styleUrls: ['./mediacreate.component.scss']
})
export class MediacreateComponent implements OnInit {

  @Input() gid?: number;
  @Input() uid?: string;

  pools?: Pool[];
  step: Step = Step.STEP_SET_OPTIONS;

  constructor(private vs: VelocityService, private nf: NotificationService) { }

  ngOnInit(): void {
    this.vs.get_poollist(this.gid!).then(
      res => {
        this.pools = res.pools;

        if(this.pools?.length == 0) {
          this.step = Step.STEP_ERROR_NO_MP;
        }
      }
    )
  }

  submit(f: NgForm) {
    this.step += 1;

    this.vs.create_media(+f.value.mediapool, this.gid!, f.value.name, +f.value.size).then(
      res => {
        // Really ugly hack, but this seems to be a common issue..
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        this.nf.send_notification(NotificationType.SUCCESS, "Media created.");

        f.resetForm();
        medialist_event.emit();
      }
    ).catch(err => {
      this.nf.send_notification(NotificationType.ERROR, err.error.message);

      // Really ugly hack, but this seems to be a common issue..
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    })
  }
}
