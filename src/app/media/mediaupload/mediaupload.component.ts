import { Component, Input, OnInit } from '@angular/core';
import { Pool } from 'src/app/classes/media';
import { NotificationType } from 'src/app/notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';
import { VelocityService } from 'src/app/services/velocity.service';

export enum Step {
  STEP_ERROR_NO_MP = -1,
  STEP_PICK_FILE = 0,
  STEP_CHOOSE_MPID = 1,
  STEP_PROGRESS = 2
}

@Component({
  selector: 'app-mediaupload',
  templateUrl: './mediaupload.component.html',
  styleUrls: ['./mediaupload.component.scss']
})
export class MediauploadComponent implements OnInit {

  @Input() gid?: number;
  @Input() uid?: string;

  step: Step = Step.STEP_PICK_FILE;
  pools?: Pool[];
  file: any;
  pool?: Pool;
  mp: any;
  progress: number = 0;

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

  select_file(event: any) {
    this.step = Step.STEP_CHOOSE_MPID;
    this.file = event.target.files[0];
  }

  select_pool(pool: Pool) {
    console.log("Selecting mediapool: " + pool)
    this.pool = pool;
  }

  confirm_upload() {
    this.step = Step.STEP_PROGRESS;
    let type = "";

    // vnd.efi.iso is a bootable iso
    if(this.file.type == "application/vnd.efi.iso") {
      type = "ISO";
    } else {

      // Browser doesn't have a type for ipsw (file.type == "")
      if(this.file.name.toLowerCase().endsWith(".ipsw")) {
        type = "IPSW"

      // Oh well, assume disk..
      } else {
        type = "DISK"
      }
    }

    this.vs.upload_media(this.file.name, this.pool?.mpid!, this.gid!, type, type == "ISO" ? true : false, this.file).then(
      res => {
        res.subscribe({
          next: (v) => {
            this.progress = v.loaded / v.total;
          },
          complete: () => {
            this.nf.send_notification(NotificationType.SUCCESS, "File upload completed!");

            // Really ugly hack, but this seems to be a common issue..
            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

            // Reset
            this.step = 0;
            this.file = null;
            this.pool = undefined;
            this.mp = null;
            this.progress = 0;

          }
        })
      }
    )
  }

}
