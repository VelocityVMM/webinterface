import { Component, Input, OnInit } from '@angular/core';
import { Group } from '../classes/group';
import { Pool } from '../classes/media';
import { VelocityService } from '../services/velocity.service';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../notification/notification.component';

@Component({
  selector: 'app-poolpermissions',
  templateUrl: './poolpermissions.component.html',
  styleUrls: ['./poolpermissions.component.scss']
})
export class PoolpermissionsComponent implements OnInit{

  @Input() group?: Group;
  @Input() pool?: Pool;
  public pool_settings: Pool = new Pool()

  constructor(private vs: VelocityService, private nf: NotificationService) { }

  ngOnInit(): void {
    this.update()
  }

  update() {
    // Apply pool settings
    this.pool_settings.name = this.pool?.name
    this.pool_settings.mpid = this.pool?.mpid
    this.pool_settings.manage = false;
    this.pool_settings.write = false;

    // Fetch the pool permissions for this group
    this.vs.get_poollist(this.group?.gid!).subscribe({
      next: (v) => {
        for(let pool of v) {
          // Check if we already have some permissions on this pool to restore.
          if(pool.mpid == this.pool!.mpid) {
            this.pool_settings.manage = pool.manage;
            this.pool_settings.write = pool.write;
          }
        }
      }
    })
  }

  submit(f: any) {
    // Really ugly hack, but this seems to be a common issue..
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    this.vs.assign_pool(this.group?.gid!, this.pool_settings).subscribe({
      next: (v) => {
        this.nf.send_notification(NotificationType.SUCCESS, "Mediapool permissions applied.")
        this.update()
        this.vs.permissions_changed.emit()
      },
      error: (e) => {
        this.nf.send_notification(NotificationType.ERROR, "Mediapool permissions could not be applied.")
        this.update()
        this.vs.permissions_changed.emit()
      }
    })
  }

  revoke() {
    // Really ugly hack, but this seems to be a common issue..
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    this.vs.revoke_pool(this.group?.gid!, this.pool?.mpid!).subscribe({
      next: (v) => {
        this.nf.send_notification(NotificationType.SUCCESS, "Mediapool permissions revoked.")
        this.update()
      }, error: (e) => {
        this.nf.send_notification(NotificationType.SUCCESS, "Could not revoke mediapool permissions.")
        this.update()
      }
    })
  }
}
