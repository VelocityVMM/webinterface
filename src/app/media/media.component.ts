import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { VELOCITY_URL, VelocityService } from '../services/velocity.service';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../notification/notification.component';
import { LoginService } from '../services/login.service';
import { Membership } from '../classes/user';
import { Group, parse_flat_to_tree } from '../classes/group';
import { Flowbite } from '../flowbitefix/flowbitefix';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
@Flowbite()
export class MediaComponent implements OnInit {

  public groups?: Group[];
  public media: { [gid: number] : any; } = {};

  constructor(private http: HttpClient, private vs: VelocityService, 
              private ls: LoginService, private nf: NotificationService) { } 

  ngOnInit(): void {
    if(this.ls.get_user() == undefined) {
      // Wait until user information is available.
      this.ls.user_set.subscribe({
        next: () => {
          // User is now set, we can set the media list.
          this.update(this.ls.get_user()?.memberships)
        }
      })
    } else {
      this.update(this.ls.get_user()?.memberships)
    }

    this.vs.permissions_changed.subscribe({
      next: () => {
        // User should be set by the time the we update permissions
        this.update(this.ls.get_user()?.memberships)
      }
    })
  }

  update(memberships: Membership[] | undefined) {
    // If we have no memberships we also dont have media.
    if(memberships == undefined) {
      return;
    }
    // Mutate memberships (Add inherited directly)
    parse_flat_to_tree(memberships)

    // Fetch medialist for every group
    for(let membership of memberships) {
      if(membership.has_permission("velocity.media.list")) {
        this.vs.get_medialist(membership.gid).subscribe({
          next: (v) => {
            this.media[membership.gid] = (v as any).media
          }
        })
      }
    }
  }

  upload_media(event: any) {

    // Acquire the current AuthKey
    this.ls.get_authkey().subscribe({
      next: (authkey) => {
        // file to upload
        const file: File = event.target.files[0];

        // Construct the form_data
        const form_data = new FormData();
        form_data.append('file', file)


        // Build the http request
        const headers = new HttpHeaders()
          .set('Content-Type', 'application/octet-stream')
          .set('x-velocity-authkey', authkey)
          .set('x-velocity-mpid', '0')
          .set('x-velocity-gid', '0')
          .set('x-velocity-name', '0')
          .set('x-velocity-type', 'ISO')
          .set('x-velocity-readonly', 'false')
          .set('File-Name', file.name);

        const req = new HttpRequest('put', VELOCITY_URL + "m/media/upload", form_data, {
          headers: headers,
          reportProgress: true
        })

        this.http.request(req).subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              const percent_done = Math.round(100 * event.loaded / event.total!);
            
              console.log(percent_done)
              //  this.upload_progress = percentDone
      
              
            } else if (event.type === HttpEventType.Response) {
      
              this.nf.send_notification(NotificationType.SUCCESS, "Media file uploaded!")
      
            //  this.upload_progress = 0
            //  this.show_upload_chooser = true
            //  this.show_upload_popup = false
            }
          }, error: (e) => {
            this.nf.send_notification(NotificationType.ERROR, "Could not upload media file.")
          }
        })
      }
    })
  }
}
