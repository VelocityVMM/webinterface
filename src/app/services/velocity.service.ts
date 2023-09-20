import { EventEmitter, Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserInfo, Users } from '../classes/user';


const VELOCITY_URL = "http://localhost:8090/";

@Injectable({
  providedIn: 'root'
})
export class VelocityService {

  public group_tree_changed: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, private ls: LoginService) { }

  get_userlist(): Observable<User[]> {
    const userlist_observable = new Observable<any>((observer) => {

      // async fetch and await Authkey
      this.ls.get_authkey().subscribe({
        next: (authkey) => {
          
          // Use the acquired Authkey to send the actual request
          this.http.post<Users>(VELOCITY_URL + "u/user/list", { authkey: authkey }).subscribe({
            next: (v) => {
              observer.next(v.users)
              observer.complete()
            }, error: (e) => {
              observer.error(e)
              observer.complete()
            }
          })
        }
      })
    })
    return userlist_observable;
  }

  create_user(username: string, password: string): Observable<any> {
    const createuser_observable = new Observable<any>((observer) => {

      // async fetch and await Authkey
      this.ls.get_authkey().subscribe({
        next: (authkey) => {

          // Use the acquired Authkey to send the actual request
          this.http.put<User>(VELOCITY_URL + "u/user/", 
            {
              name: username,
              password: password, 
              authkey: authkey
            }
          ).subscribe({
            next: (v) => {
              observer.next(v)
              observer.complete()
            }, error: (e) => {
              observer.error(e)
              observer.complete()
            }
          })
        }
      })
    })
    return createuser_observable
  }

  get_user_info(uid: number): Observable<UserInfo> { 
    return new Observable<any>((observer) => {

      // async fetch and await Authkey
      this.ls.get_authkey().subscribe({
        next: (authkey) => {

          // Use the acquired Authkey to send the actual request
          this.http.request<UserInfo>('post', VELOCITY_URL + "u/user", 
            { body: 
              {
                authkey: authkey,
                uid: uid
              }
            }
          ).subscribe({
            next: (v) => {
              observer.next(v)
              observer.complete()
            }, error: (e) => {
              observer.error(e)
              observer.complete()
            }
          })
        }
      })
    })
  }

  add_permission(uid: number, gid: number, permission_identifier: string): Observable<any> {
    return new Observable<any>((observer) => {

      // async fetch and await Authkey
      this.ls.get_authkey().subscribe({
        next: (authkey) => {

          // Use the acquired Authkey to send the actual request
          this.http.request('put', VELOCITY_URL + "u/user/permission", 
            { body: 
              {
                authkey: authkey,
                uid: uid,
                gid: gid,
                permission: permission_identifier
              }
            }
          ).subscribe({
            next: (v) => {
              observer.next(v)
              observer.complete()
            }, error: (e) => {
              observer.error(e)
              observer.complete()
            }
          })
        }
      })
    })
  }

  revoke_permission(uid: number, gid: number, permission_identifier: string): Observable<any> {
    return new Observable<any>((observer) => {

      // async fetch and await Authkey
      this.ls.get_authkey().subscribe({
        next: (authkey) => {

          // Use the acquired Authkey to send the actual request
          this.http.request('delete', VELOCITY_URL + "u/user/permission", 
            { body: 
              {
                authkey: authkey,
                uid: uid,
                gid: gid,
                permission: permission_identifier
              }
            }
          ).subscribe({
            next: (v) => {
              observer.next(v)
              observer.complete()
            }, error: (e) => {
              observer.error(e)
              observer.complete()
            }
          })
        }
      })
    })
  }

  delete_user(uid: number): Observable<any> {
    return new Observable<any>((observer) => {

      // async fetch and await Authkey
      this.ls.get_authkey().subscribe({
        next: (authkey) => {

          // Use the acquired Authkey to send the actual request
          this.http.request<User>('delete', VELOCITY_URL + "u/user/", 
            { body: 
              {
                authkey: authkey,
                uid: uid
              }
            }
          ).subscribe({
            next: (v) => {
              observer.next(v)
              observer.complete()
            }, error: (e) => {
              observer.error(e)
              observer.complete()
            }
          })
        }
      })
    })
  }

  get_grouplist(): Observable<any> {
    return new Observable<any>((observer) => {

      // async fetch and await Authkey
      this.ls.get_authkey().subscribe({
        next: (authkey) => {

          // Use the acquired Authkey to send the actual request
          this.http.request('post', VELOCITY_URL + "u/group/list", 
            { body: 
              {
                authkey: authkey,
              }
            }
          ).subscribe({
            next: (v) => {
              observer.next(v)
              observer.complete()
            }, error: (e) => {
              observer.error(e)
              observer.complete()
            }
          })
        }
      })
    })
  }

  add_subgroup(name: string, parent_gid: number): Observable<any> {
    return new Observable<any>((observer) => {

      // async fetch and await Authkey
      this.ls.get_authkey().subscribe({
        next: (authkey) => {

          // Use the acquired Authkey to send the actual request
          this.http.request('put', VELOCITY_URL + "u/group", 
            { body: 
              {
                authkey: authkey,
                name: name,
                parent_gid: parent_gid
              }
            }
          ).subscribe({
            next: (v) => {
              observer.next(v)
              observer.complete()
            }, error: (e) => {
              observer.error(e)
              observer.complete()
            }
          })
        }
      })
    })
  }

  delete_group(gid: number): Observable<any> {
    return new Observable<any>((observer) => {

      // async fetch and await Authkey
      this.ls.get_authkey().subscribe({
        next: (authkey) => {

          // Use the acquired Authkey to send the actual request
          this.http.request('delete', VELOCITY_URL + "u/group", 
            { body: 
              {
                authkey: authkey,
                gid: gid
              }
            }
          ).subscribe({
            next: (v) => {
              observer.next(v)
              observer.complete()
            }, error: (e) => {
              observer.error(e)
              observer.complete()
            }
          })
        }
      })
    })
  }
}