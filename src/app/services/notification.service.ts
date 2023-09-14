import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { NotificationComponent, NotificationType } from '../notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  vcr!: ViewContainerRef;
  
  constructor() { }

  set_notification_template_ref(vcr: ViewContainerRef) { 
    this.vcr = vcr
  }

  send_notification(notification_type: NotificationType, message: string) {
    if(this.vcr == undefined) {
      console.error("[BUG] ComponentRef is not set! Cannot send notification (yet).")
      return
    }

    const ref: ComponentRef<NotificationComponent> = this.vcr.createComponent(NotificationComponent)
    ref.instance.notification_type = notification_type;
    ref.instance.message = message;

    setTimeout(() => {
      const index = this.vcr.indexOf(ref.hostView)
      if (index != -1) this.vcr.remove(index)
    }, 3000)
  }
}
