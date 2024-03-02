import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Membership } from 'src/app/classes/user';
import { NotificationType } from 'src/app/notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';
import { VelocityService } from 'src/app/services/velocity.service';

@Component({
  selector: 'app-createvm',
  templateUrl: './createvm.component.html',
  styleUrls: ['./createvm.component.scss']
})
export class CreatevmComponent implements OnInit {
  
  // Groups where we have create VM privileges
  memberships: Membership[] = [ ];

  // The current step
  step: number = 0;
  
  // Slider values for step-1
  cpu_slider?: any = 4;
  mem_slider?: any = 4096;

  // Display array for step-2
  displays: any[] = [];

  // Media array for step-3
  media: any[] = [];

  // VMInfo
  vm_info: any = { }

  constructor(private vs: VelocityService, private nf: NotificationService) { }

  ngOnInit(): void {
    this.vm_info.disks = [ ]

    // TODO: Properly implement this once the whole nic stuff + the config works
    this.vm_info.nics = [ ]
    this.vm_info.rosetta = true;
    this.vm_info.autostart = false;

    this.vs.get_user().then(u => {

      for(let membership of u.memberships) {
        const ms = new Membership(0, "", 0, [ ])
        Object.assign(ms, membership);
        
        if(ms.has_permission("velocity.vm.create")) {
          this.memberships.push(ms);
        }
      }
    });
  }

  submit(f: NgForm | undefined) {
    switch(this.step) {
      // TYPE
      case 0: {
        this.vm_info.name = (f as NgForm).value.vmname;
        this.vm_info.gid = +(f as NgForm).value.gid;
        this.vm_info.type = (f as NgForm).value.vmtype;

        // Fetch medialist for the selected group
        this.vs.get_medialist(+this.vm_info.gid).then(res => {
          for(let m of res.media) {
            m.enabled = true;
            this.media.push(m);
          }
        }).catch(_ => { })
        break;
      }

      // RAM, CPU
      case 1: {
        this.vm_info.cpus = this.cpu_slider!;
        this.vm_info.memory_mib = this.mem_slider!;
        break;
      }

      case 2: {
        this.vm_info.displays = this.displays;
        break;
      }

    }
    this.step++;
  }

  // TODO: Fix Copy/paste of non-numerics
  validate_num(e: any): boolean {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true
  }

  add_display(f: NgForm) {
    this.displays.push(f.value);
    f.reset()
  }

  attach_vdisk(mode: string, m: any) {
    this.vm_info.disks.push({
      "mid": m.mid,
      "mode": mode,
      "name": m.name,
      "readonly": mode == "ISO" ? true : false
    })

    m.enabled = false;
  }

  remove_vdisk(m: any) {
    for(let media of this.media) {
      if(media.mid == m.mid) {
        media.enabled = true;
        break;
      }
    }

    this.vm_info.disks = this.vm_info.disks.filter((media: any) => {
      return m.mid != media.mid;
    })
  }

  // Describe displays as a String
  displays_string(): string {
    let res = "";
    for(let d of this.vm_info.displays) {
      if(res == "") {
        res = d.name + " " + "(" + d.width + "x" + d.height + ")";
      } else {
        res = res + ", " + d.name + " " + "(" + d.width + "x" + d.height + ")";
      }
    }
    return res;
  }

  // Describe attached media as a String
  media_string(): string {
    let res = "";
    for(let m of this.vm_info.disks) {
      if(res == "") {
        res = m.name + " " + "(" + m.mode + ")";
      } else {
        res = res + ", " + m.name + " " + "(" + m.mode + ")";
      }
    }
    return res;
  }

  create() {
    // Really ugly hack, but this seems to be a common issue..
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    this.vs.create_vm(this.vm_info).then(
      res => {
        this.nf.send_notification(NotificationType.SUCCESS, "Virtual Machine created!");
      }).catch(err => {
        this.nf.send_notification(NotificationType.ERROR, "Could not create Virtual Machine.")
      })
  }
}
