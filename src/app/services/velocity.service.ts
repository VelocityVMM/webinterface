import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pool } from '../classes/media';
import { AuthService } from '../auth/auth.service';
import { User, UserInfo } from '../classes/user';
import { Observable } from 'rxjs';

export const VELOCITY_URL = "http://192.168.1.188:8090/";

@Injectable({
  providedIn: 'root'
})
export class VelocityService {

  constructor(private http: HttpClient, private as: AuthService) { }

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
  async get_user(uid?: number): Promise<any> {
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

  async assign_pool(gid: number, pool: Pool): Promise<any> {
    return this.as.privileged_request('put', VELOCITY_URL + "m/pool/assign", {
      gid: gid,
      mpid: pool.mpid,
      quota: 0, // Hardcoded '0' for now, does nothing on the backend anyway..
      write: pool.write,
      manage: pool.manage
    })
  }

  async revoke_pool(gid: number, mpid: number): Promise<any> {
    return this.as.privileged_request('delete', VELOCITY_URL + "m/pool/assign", {
      gid: gid,
      mpid: mpid
    })
  }

  async get_medialist(gid: number): Promise<any> {
    return this.as.privileged_request('post', VELOCITY_URL + "m/media/list", {
      gid: gid,
    })
  }

  async create_media(mpid: number, gid: number, name: string, size: number): Promise<any> {
    return this.as.privileged_request('put', VELOCITY_URL + "m/media/create", {
      mpid: mpid,
      gid: gid,
      name: name,
      size: size
    })
  }

 /*
  * Get the current users medialists
  */
  async get_user_medialists(): Promise<any> {
    const medialists = new Map();
    
    const user = await this.get_user();
    for(let membership of user.memberships) {
      medialists.set(membership.gid, (await this.get_medialist(membership.gid)).media);
    }
    return medialists;
  }

  async upload_media(file_name: string, mpid: number, gid: number, type: string, readonly: boolean, file: any): Promise<Observable<any>> {
    return this.as.privileged_fileupload_request(file_name, mpid, gid, type, readonly, file);
  }
}