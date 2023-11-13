import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Mutex } from 'async-mutex';
import { VELOCITY_URL } from '../services/velocity.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { VInfo, VWarn } from '../log/log';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authkey: AuthKey = new AuthKey(this.http, this.router);

  constructor(private http: HttpClient, private router: Router) { 
    this.authkey.restore_session()
  }

  // Attempt to login with this username and password
  async login(username: string, password: string) {
    return this.authkey.login(username, password);
  }

  // Attempt to logout remotely, remove saved session
  async logout() {
    if(!await this.authkey.logout()) {
      VWarn("Could not terminate session remotely. Authkey may still be valid!")
    }
    VInfo("Local session terminated.")
    this.router.navigate(['/login']);
  }

  // Send a privliged request to Velocity
  async privileged_request(method: string, url: string, request_payload: any): Promise<any> {
    // Check if passed method is valid.
    if(method != "post" && method != "get" && method != "delete" && method != "put") {
      return undefined;
    }

    // Use the acquired Authkey to send the request
    request_payload["authkey"] = await this.authkey.get_key()
    return firstValueFrom(this.http.request(method, url, { body: request_payload }));
  }

  // canActivate function for router
  async canActivate(): Promise<boolean> {
    return await this.authkey.is_valid();
  }
}

class AuthKey {
  // Mutex to ensure Authkey is unused while its being refreshed.
  private mutex = new Mutex();

  // Actual key data
  private key?: string;
  private expires?: number;
  
  // Interval to refresh key
  private refresh_interval: any;

  constructor(private http: HttpClient, private router: Router) { }

  async login(username: string, password: string) {
    VInfo("Sending sign in request!")
    // Lock the mutex
    await this.mutex.acquire();

    // Send the auth request
    let response: any;
    try {
      response = await lastValueFrom(this.http.post(VELOCITY_URL + "u/auth", {
        username: username,
        password: password
      }));

      this.key = response.authkey;
      this.expires = response.expires;
      this.sync();

      this.mutex.release();
      this.refresh_interval = setInterval(() => {
        this.refresh();
      }, 45000)

      return true;
    } catch(error) {
      this.mutex.release();
      return false; 
    }
  }

  async logout() {
    // Lock the mutex
    await this.mutex.acquire();

    // Stop refreshing
    clearInterval(this.refresh_interval)

    // Send the deauth request
    try {
      await lastValueFrom(this.http.request('delete', VELOCITY_URL + "u/auth", 
      {
        body: { 
          authkey: this.key
        }
      }));
      this.reset()

      this.mutex.release();
      return true;
    } catch(error) {
      this.mutex.release();
      return false; 
    }
  }

  async is_valid() {
    // Lock the mutex
    await this.mutex.acquire();

    // Authkey is unset
    if(this.key == undefined || this.expires == undefined) {
      return false;
    }

    // Authkey expired
    if(this.expires > Date.now()) {
      return false;
    }

    // Unlock
    this.mutex.release()

    // Local key validation
    return true;  
  }

  // Note: Only call this if the mutex is acquired!
  sync() {
    if(this.key == undefined || this.expires == undefined) {
      return;
    }

    localStorage.setItem("AuthKey", this.key);
    localStorage.setItem("Expires", this.expires.toString());
  }

  // Note: Only call this if the mutex is acquired!
  reset() {
    this.key = undefined;
    this.expires = undefined;

    localStorage.removeItem("AuthKey")
    localStorage.removeItem("Expires")
  }

  async restore_session(): Promise<boolean> {
    await this.mutex.acquire()
    
    let authkey = localStorage.getItem("AuthKey")
    let expires = localStorage.getItem("Expires")

    // Not set
    if(authkey == null || expires == null) {
      this.mutex.release()
      return false;
    }

    // Invalid.
    if(+expires > Date.now()) {
      this.mutex.release()
      return false;
    }

    this.key = authkey
    this.expires = +expires

    this.mutex.release()

    // Could not be refreshed, remote restarted
    if(!await this.refresh()) {
      return false;
    }

    // Start the refresh interval 
    this.refresh_interval = setInterval(() => {
      this.refresh();
    }, 45000)
    
    return true;
  }

  async refresh(): Promise<boolean> {
    VInfo("Refreshing authkey!")
    await this.mutex.acquire()
    
    let new_key;
    try {
      new_key = await lastValueFrom(this.http.patch<AuthkeyResponse>(VELOCITY_URL + "u/auth", {
        authkey: this.key
      }))
    } catch {
      // Could not refresh!
      VInfo("Could not refresh authkey!")

      // Stop refreshing
      clearInterval(this.refresh_interval)
      
      this.mutex.release();
      this.reset()
      this.router.navigate(['/login'])
      return false;
    }

    this.key = new_key!.authkey
    this.expires = new_key!.expires
    this.sync()

    this.mutex.release()
    return true;
  }

  async get_key(): Promise<string | undefined> {
    if(!await this.is_valid()) {
      return undefined;
    }

    await this.mutex.acquire();
    const key = this.key;
    this.mutex.release();
    return key;
  }

}

class AuthkeyResponse {
  public authkey: string;
  public expires: number;

  constructor(authkey: string, expires: number) {
    this.authkey = authkey;
    this.expires = expires;
  }
}

export const canActivateFn: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(AuthService).canActivate();
};
