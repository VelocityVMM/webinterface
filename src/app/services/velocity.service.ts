import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pool } from '../classes/media';
import { AuthService } from '../auth/auth.service';
import { UserInfo } from '../classes/user';
import { Observable } from 'rxjs';

export const VELOCITY_URL = "http://192.168.1.188:8090/";

@Injectable({
  providedIn: 'root'
})
export class VelocityService {

  constructor(private as: AuthService) { }

  /*
   * Get list of users
   */
  async get_userlist(): Promise<any> {
    return this.as.privileged_request('post', VELOCITY_URL + "u/user/list", { });
  }

  /*
   * Create a new User
   */
  async create_user(username: string, password: string): Promise<any> {
    return this.as.privileged_request('put', VELOCITY_URL + "u/user", 
    {
      name: username,
      password: password
    })
  }

  /*
   * Get User Info
   */
  async get_user(uid?: number): Promise<UserInfo> {
    return this.as.privileged_request('post', VELOCITY_URL + "u/user", 
    {
      uid: uid
    })
  }

  /*
   * Assign a permission
   */
  async add_permission(uid: number, gid: number, permission_identifier: string): Promise<any> {
    return this.as.privileged_request('put', VELOCITY_URL + "u/user/permission", 
    {
      uid: uid,
      gid: gid,
      permission: permission_identifier
    })
  }

  /*
   * Assign a permission
   */
  async revoke_permission(uid: number, gid: number, permission_identifier: string): Promise<any> {
    return this.as.privileged_request('delete', VELOCITY_URL + "u/user/permission", 
    {
      uid: uid,
      gid: gid,
      permission: permission_identifier
    })
  }

  /*
  * Delete a user
  */
  async delete_user(uid: number): Promise<any> {
    return this.as.privileged_request('delete', VELOCITY_URL + "u/user/", 
    {
      uid: uid,
    })
  }

  /*
  * Get grouplist
  */
  async get_grouplist(): Promise<any> {
    return this.as.privileged_request('post', VELOCITY_URL + "u/group/list", { });
  }

  /*
  * Add a new subgroup
  */  
  async add_subgroup(name: string, parent_gid: number): Promise<any> {
    return this.as.privileged_request('put', VELOCITY_URL + "u/group", {
      name: name,
      parent_gid: parent_gid
    })
  }

  /*
  * Delete group
  */
  async delete_group(gid: number): Promise<any> {
    return this.as.privileged_request('delete', VELOCITY_URL + "u/group", {
      gid: gid
    })
  }

  /*
  * Get poollist
  */
  async get_poollist(gid: number): Promise<any> {
    return this.as.privileged_request('post', VELOCITY_URL + "m/pool/list", {
      gid: gid
    })
  }

  /*
  * This really should be redone api side..
  */
  async get_poollist_all(): Promise<any> {
    let user: UserInfo;
    
    try {
      user = await this.get_user();
    } catch {
      return [ ]
    }

    const pools: Pool[] = [ ];

    // Check for every membership
    for(let mb of user.memberships) {

      // Iterate through every pool
      for(let pool of (await this.get_poollist(mb.gid)).pools) {
        let add = true;

        // Check if we already have this pool
        for(let p of pools) {
          if(p.mpid == pool.mpid) {
            add = false;
          }
        }
  
        if(add) {
          pools.push(pool)
        }
      }
    }
    return pools;
  }

  /*
  * Assign group permissions to mediapool
  */
  async assign_pool(gid: number, pool: Pool): Promise<any> {
    return this.as.privileged_request('put', VELOCITY_URL + "m/pool/assign", {
      gid: gid,
      mpid: pool.mpid,
      quota: 0, // Hardcoded '0' for now, does nothing on the backend anyway..
      write: pool.write,
      manage: pool.manage
    })
  }

  /*
  * Revoke permissions from mediapool from group
  */
  async revoke_pool(gid: number, mpid: number): Promise<any> {
    return this.as.privileged_request('delete', VELOCITY_URL + "m/pool/assign", {
      gid: gid,
      mpid: mpid
    })
  }

  /*
  * Fetch medialist for group
  */
  async get_medialist(gid: number): Promise<any> {
    return this.as.privileged_request('post', VELOCITY_URL + "m/media/list", {
      gid: gid,
    })
  }

  /*
  * Create disk media
  */
  async create_media(mpid: number, gid: number, name: string, size: number): Promise<any> {
    return this.as.privileged_request('put', VELOCITY_URL + "m/media/create", {
      mpid: mpid,
      gid: gid,
      type: "DISK",
      name: name,
      size: (size *  1e+6) // in bytes
    })
  }

 /*
  * Get the current users medialists
  */
  async get_user_medialists(): Promise<any> {
    const medialists = new Map();
    
    const user = await this.get_user();
    for(let membership of user.memberships) {
      // TOOD: Check if we have the required permissions
      medialists.set(membership.gid, (await this.get_medialist(membership.gid)).media);
    }
    return medialists;
  }

  /*
  * Upload media to server
  */
  async upload_media(file_name: string, mpid: number, gid: number, type: string, readonly: boolean, file: any): Promise<Observable<any>> {
    return this.as.privileged_fileupload_request(file_name, mpid, gid, type, readonly, file);
  }

  /*
  * Delete media from server
  */
  async delete_media(mid: number) {
    return this.as.privileged_request("delete", VELOCITY_URL + "m/media", {
      mid: mid
    });
  }

  /*
  * Get all VMLists of user
  */
 async get_vmlists() {
  const vmlists = new Map();
    
  const user = await this.get_user();
  for(let membership of user.memberships) {
    // TOOD: Check if we have the required permissions
    vmlists.set(membership.gid, (await this.get_vmlist(membership.gid)).vms);
  }
  return vmlists;
 }

  /*
  * Fetch vmlist for group
  */
  async get_vmlist(gid: number): Promise<any> {
    return this.as.privileged_request('post', VELOCITY_URL + "v/vm/list", {
      gid: gid,
    })
  }
  
  /*
  * Create a new Virtual Machine
  */
  async create_vm(vm: any): Promise<any> {
    if(vm.type == "efi") {
      return this.as.privileged_request('put', VELOCITY_URL + "v/vm/efi", vm)
    } else {
      // TODO: Add MAC..
    }
  }

  /*
  * Start a given Virtual Machine
  */
 async change_vmstate(vmid: number, state: string, force: boolean) {
  return this.as.privileged_request('post', VELOCITY_URL + "v/vm/state", {
    vmid: vmid,
    state: state,
    force: force
  })
 }
}