import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, observable } from 'rxjs';

const VELOCITY_URL = "http://localhost:8090/";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // The current in-use AuthKey
  private authkey?: AuthKey;
  private refreshInterval: any;

  constructor(private http: HttpClient, private router: Router) { }

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

          // save the current AuthKey to local storage
          localStorage.setItem("AuthKey", v.authkey);
          localStorage.setItem("Expires", v.expires.toString())

          this.refreshInterval = setInterval(() => {
            this.refresh();
          }, 60000)
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
    
    // Stop refreshing
    clearInterval(this.refreshInterval)

    // remove localStorage Items
    localStorage.removeItem("AuthKey")
    localStorage.removeItem("Expires")

    return this.http.request('delete', VELOCITY_URL + "u/auth", { body: requestData })
  }

  //
  // Requests a new Authkey
  //
  refresh() {
    this.http.patch<AuthKey>(VELOCITY_URL + "u/auth", {
      authkey: this.authkey?.authkey
    }).subscribe({
      next: (v) => {
        this.authkey = v

        localStorage.setItem("AuthKey", v.authkey);
        localStorage.setItem("Expires", v.expires.toString())
      },
      error: (e) => {
        console.log("Could not refresh AuthKey.")
        this.authkey = undefined;
        this.router.navigate(["/login"])
      },
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

  //
  // Restores the saved AuthKey if it exists
  //
  restore_session() {
    let authkey = localStorage.getItem("AuthKey")
    let expires = localStorage.getItem("Expires")

    if(authkey == null || expires == null) {
      return;
    }

    if(+expires > Date.now()) {
      return;
    }

    // Still valid, we can use it.
    this.authkey = new AuthKey(authkey, +expires)
    this.refresh();
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