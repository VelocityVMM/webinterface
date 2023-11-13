import { Component, Input, OnInit } from '@angular/core';
import { Group } from 'src/app/classes/group';
import { Pool } from 'src/app/classes/media';
import { Flowbite } from 'src/app/flowbitefix/flowbitefix';
import { NotificationType } from 'src/app/notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';
import { VelocityService } from 'src/app/services/velocity.service';

@Component({
  selector: 'app-poolpermissions',
  templateUrl: './poolpermissions.component.html',
  styleUrls: ['./poolpermissions.component.scss']
})
@Flowbite()
export class PoolpermissionsComponent implements OnInit {

  // The ID this modal will have
  @Input() uid?: string;

  // Title of the modal
  @Input() title?: string;

  // Group to apply permissions on
  @Input() group?: Group; 

  pools: Pool[] = [ ];
  selected_pool: Pool | undefined;

  constructor(private vs: VelocityService, private nf: NotificationService) { }

  ngOnInit(): void {

    // Fetch all pools
    this.vs.get_poollist_all().then(
      res => {
        // Store all pools
        this.pools = res;
        
        // Set the first pool as selected pool
        if(this.pools.length != 0) {

          // Determine the effective permissions for our group, yet another request..
          this.vs.get_poollist(this.group!.gid!).then(
            res => {
              let found = false;

              // Find already applied permissions
              for(let p of res.pools) {
                if(p.mpid == this.pools[0].mpid) {
                  found = true;
                  this.selected_pool = p;
                }
              }
              
              // No permissions set, set none as default.
              if(!found) {
                this.selected_pool = this.pools[0];
                this.selected_pool.manage = false;
                this.selected_pool.write = false;
              }
            }
          )
        }
      }
    )
  }

  set_selected(pool: Pool) {
    this.vs.get_poollist(this.group!.gid!).then(
      res => {
        let found = false;

        // Find already applied permissions
        for(let p of res.pools) {
          if(p.mpid == pool.mpid) {
            found = true;
            this.selected_pool = p;
          }
        }
        
        // No permissions set, set none as default.
        if(!found) {
          this.selected_pool = pool;
          this.selected_pool.manage = false;
          this.selected_pool.write = false;
        }
      }
    )

  }

  toggle_write() {
    this.selected_pool!.write = !this.selected_pool?.write
  }

  toggle_manage() {
    this.selected_pool!.manage = !this.selected_pool?.manage
  }

  apply() {
    // Really ugly hack, but this seems to be a common issue..
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    this.vs.assign_pool(this.group!.gid!, this.selected_pool!).then(
      res => {
        this.nf.send_notification(NotificationType.SUCCESS, "Mediapool permissions applied.");
      }
    ).catch(err => {})
  }

  revoke() {
    // Really ugly hack, but this seems to be a common issue..
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    this.vs.revoke_pool(this.group!.gid!, this.selected_pool!.mpid!).then(
      res => {
        this.nf.send_notification(NotificationType.SUCCESS, "Mediapool permissions revoked.");

        // Reset local
        this.selected_pool!.manage! = false;
        this.selected_pool!.write! = false;
      }
    ).catch(err => {})
  }

}
