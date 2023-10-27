import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LogService } from './log.service';
import { Membership, UserInfo } from '../classes/user';
import { VELOCITY_URL } from './velocity.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // The current in-use AuthKey
  private authkey?: AuthKey;
  private refresh_in_progress: boolean = false;
  @Output() refresh_complete: EventEmitter<any> = new EventEmitter();

  // The current User
  private user?: UserInfo;
  @Output() user_set: EventEmitter<any> = new EventEmitter();

  // AuthKey refresh Interval
  private refreshInterval: any;

  constructor(private vlog: LogService, private http: HttpClient, private router: Router) { }

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
          }, 30000)

          // Set the current User
          this.set_user();
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
    this.refresh_in_progress = true;
    this.vlog.VInfo("Refreshing Authkey..", "LS")

    this.http.patch<AuthKey>(VELOCITY_URL + "u/auth", {
      authkey: this.authkey?.authkey
    }).subscribe({
      next: (v) => {
        this.authkey = v

        localStorage.setItem("AuthKey", v.authkey);
        localStorage.setItem("Expires", v.expires.toString())
        this.refresh_in_progress = false;
        this.refresh_complete.emit()
      },
      error: (e) => {
        this.vlog.VErr("Could not refresh Authkey. Already invalid. Aborting.", "LS")
        this.authkey = undefined;

        // clear refresh Interval
        clearInterval(this.refreshInterval)
        this.router.navigate(["/login"])
        this.refresh_in_progress = false;
        this.refresh_complete.emit()
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
    this.vlog.VInfo("Refreshing Authkey..", "LS")

    this.refresh();
    this.set_user()

    this.refreshInterval = setInterval(() => {
      this.refresh();
    }, 6000)
  }

  //
  // Get current authkey
  //
  get_authkey(): Observable<string> {
    const authkey_observable = new Observable<string>((observer) => {

      // Authkey is being refreshed, await refresh.
      if(this.refresh_in_progress) {
        this.refresh_complete.subscribe({
          next: () => {
            observer.next(this.authkey?.authkey)
            observer.complete()
          },
          error: (e: any) => {
            observer.error(e)
            observer.complete()
          }
        })
      
      // Authkey is not being refreshed.
      } else {
        observer.next(this.authkey?.authkey)
        observer.complete()
      }
    })
    return authkey_observable
  }

  //
  // Set the current User
  //
  set_user() {
    this.vlog.VInfo("Acquiring currently logged-in User information..", "LS")

    this.get_authkey().subscribe({
      next: (authkey) => {
        this.http.post<UserInfo>(VELOCITY_URL + "u/user", { authkey: authkey }).subscribe({
          next: (v) => {
            const memberships: Membership[] = [ ];
            for(let mb of v.memberships) {
              memberships.push(new Membership(mb.gid, mb.name, mb.parent_gid, mb.permissions))
            }
            this.user = new UserInfo(v.uid, v.name, memberships);
    
            this.vlog.VInfo("User information set.", "LS")
            this.user_set.emit();
          },
          error: (e) => {
            this.vlog.VErr("Could not acquire user information.")
          }
        })
      }
    })
  }

  get_user() {
    return this.user
  }
}

/*
 * AuthKey
 */
class AuthKey {
  public authkey: string;
  public expires: number;

  constructor(authkey: string, expires: number) {
    this.authkey = authkey;
    this.expires = expires;
  }
}