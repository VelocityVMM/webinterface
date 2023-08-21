import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';

const VELOCITY_URL = "http://localhost:8090/";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // The current in-use AuthKey
  private authkey?: AuthKey;
  private refreshInterval: any;

  constructor(private http: HttpClient) { }

  //
  // Send a login Request to /u/auth, returns an Observable without
  // the actual AuthKey
  //
  login(requestData: any): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.http.post<AuthKey>(VELOCITY_URL + "u/auth", requestData).subscribe({
        next: (v) => {
          observer.next(true)
          this.authkey = v;
          this.refreshInterval = setInterval(() => {
            this.refresh();
          }, 6000)
        },
        error: (e) => {
          observer.error(e)
        },
        complete: () => {
          observer.complete()
        }
      })
    })
  }

  //
  // Sets authkey to undefined, and sends DELETE request to Velocity
  //
  logout() {
    let requestData = {
     authkey: this.authkey?.authkey
    }
    this.authkey = undefined;
    clearInterval(this.refreshInterval)

    return this.http.request('delete', VELOCITY_URL + "u/auth", { body: requestData })
  }

  //
  //
  //
  refresh() {

    this.http.patch<AuthKey>(VELOCITY_URL + "u/auth", {
      authkey: this.authkey?.authkey
    }).subscribe({
      next: (v) => {
        console.log("Refreshed. AuthKey updated")
        this.authkey = v
      },
      error: (e) => {
        console.log("Could not refresh AuthKey.")
      }
    })
  }

  //
  // Check if we are logged in
  //
  logged_in(): boolean {
    // No authkey yet.
    if(this.authkey == null) {
      return false;
    }

    // Authkey expired
    if(this.authkey.expires > Date.now()) {
      return false;
    }

    // should be valid.
    return true;    
  }
}

class AuthKey {
  public authkey: string;
  public expires: number;

  constructor(authkey: string, expires: number) {
    this.authkey = authkey;
    this.expires = expires;
  }
}