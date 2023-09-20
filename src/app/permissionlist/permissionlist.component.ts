import { Component, Input, OnInit } from '@angular/core';
import { Group } from '../classes/group';
import { VelocityService } from '../services/velocity.service';
import { Permission, User } from '../classes/user';

@Component({
  selector: 'app-permissionlist',
  templateUrl: './permissionlist.component.html',
  styleUrls: ['./permissionlist.component.scss']
})
export class PermissionlistComponent implements OnInit {

  @Input() group?: Group;
  @Input() user?: User;
  target_user_permissions: Permission[] = [ ];

  constructor(private vs: VelocityService) { }
  
  ngOnInit(): void {
    this.update_user_info()
  }

  update_user_info() {
    this.vs.get_user_info(this.user!.uid).subscribe({
      next: (v) => {
        for(let membership of v.memberships) {          
          // Find the group this Permissionlist is for in the 
          // Users memberships => User is already a member.
          if(membership.gid == this.group?.gid) {
            this.target_user_permissions = membership.permissions
          }
        }
      }, error: (e) => { }
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

    console.log(this.user?.uid!, this.group?.gid!, permission.name, is_checked)

    // Assign the permission.
    if (is_checked) {
      this.vs.add_permission(this.user?.uid!, this.group?.gid!, permission.name).subscribe({
        next: () => {
          this.update_user_info()
         },
        error: (e) => { }
      })

    // Revoke the permission
    } else {
      this.vs.revoke_permission(this.user?.uid!, this.group?.gid!, permission.name).subscribe({
        next: () => {
          this.update_user_info()
        },
        error: (e) => {
          console.error(e)
        }
      })

    }
  }
}
