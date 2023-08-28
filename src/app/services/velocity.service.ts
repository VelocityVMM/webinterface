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