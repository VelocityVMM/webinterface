import { Component, Input } from '@angular/core';
import { Group } from 'src/app/classes/group';
import { User, Permission } from 'src/app/classes/user';
import { NotificationType } from 'src/app/notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';
import { VelocityService } from 'src/app/services/velocity.service';

@Component({
  selector: 'app-permissionassign',
  templateUrl: './permissionassign.component.html',
  styleUrls: ['./permissionassign.component.scss']
})
export class PermissionassignComponent {

  @Input() group?: Group;
  @Input() user?: User;
  target_user_permissions: Permission[] = [ ];

  constructor(private vs: VelocityService, private nf: NotificationService) { }
  
  ngOnInit(): void {
    this.update_user_info()
  }

  update_user_info() {

    this.vs.get_user(this.user!.uid).then(
      res => {
        for(let membership of res.memberships) {          
          // Find the group this Permissionlist is for in the 
          // Users memberships => User is already a member.
          if(membership.gid == this.group?.gid) {
            this.target_user_permissions = membership.permissions
          }
        }
      }
    ).catch(err => {
      // TODO: .. //
    })
  }

  user_has_permission(identifier: string): boolean {
    for(let permission of this.target_user_permissions) {
      if(identifier == permission.name) {
        return true;
      }
    }
    return false;
  }

  onChange(event: any, permission: Permission): void {
    if(this.user == undefined || this.group == undefined)  {
      return;
    }
    
    const is_checked: boolean = event.target.checked;

    // Assign the permission.
    if (is_checked) {
      this.vs.add_permission(this.user?.uid!, this.group?.gid!, permission.name).then(
        _ => {

          // Refresh user info
          this.update_user_info()
      }).catch(
        err => {
          // TODO: Handle! //
        }
      )

    // Revoke the permission
    } else {

      this.vs.revoke_permission(this.user?.uid!, this.group?.gid!, permission.name).then(
        res => {
          // this.vs.permissions_changed.emit()
          this.nf.send_notification(NotificationType.SUCCESS, "Permission revoked!");
        }
      ).catch(error => {

      })
    }
  }
}
