import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


const VELOCITY_URL = "http://localhost:8090/";

@Injectable({
  providedIn: 'root'
})
export class VelocityService {

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
          this.http.put<CreateUser>(VELOCITY_URL + "u/user/", 
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

  delete_user(uid: number): Observable<any> {
    return new Observable<any>((observer) => {

      // async fetch and await Authkey
      this.ls.get_authkey().subscribe({
        next: (authkey) => {

          // Use the acquired Authkey to send the actual request
          this.http.request<CreateUser>('delete', VELOCITY_URL + "u/user/", 
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
}

export class Users {
  public users: User[]
  constructor(users: User[]) {
    this.users = users;
  }
}

export class User {
  public uid: number;
  public name: string;
  
  constructor(uid: number, name: string) {
    this.uid = uid;
    this.name = name;
  }
}

export class CreateUser {
  public uid: number;
  public name: string;

  constructor(uid: number, name: string) {
    this.uid = uid;
    this.name = name;
  }
}