import { Component } from '@angular/core';
import { Flowbite } from '../flowbitefix/flowbitefix';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
@Flowbite()
export class NotificationComponent {

  public message?: string;
  public notification_type?: NotificationType;

  is_success(): boolean {
    if(this.notification_type == NotificationType.SUCCESS) {
      return true;
    }
    return false;
  }

  is_error(): boolean {
    if(this.notification_type == NotificationType.ERROR) {
      return true;
    }
    return false;
  }

  is_warning(): boolean {
    if(this.notification_type == NotificationType.WARNING) {
      return true;
    }
    return false;
  }
}

export enum NotificationType {
  SUCCESS,
  ERROR,
  WARNING
}