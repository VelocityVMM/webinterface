import { Component, OnInit } from '@angular/core';
import { VelocityService } from 'src/app/services/velocity.service';

@Component({
  selector: 'app-vmlist',
  templateUrl: './vmlist.component.html',
  styleUrls: ['./vmlist.component.scss']
})
export class VmlistComponent implements OnInit {
  
  vms: Map<number, any[]>;

  constructor(private vs: VelocityService) {
    this.vms = new Map<number, any[]>()
  }

  ngOnInit(): void {
    this.vs.get_vmlists().then(res => {
      this.vms = res;
    })
  }

  test() {
    this.vs.change_vmstate(1, "RUNNING", true).then(
      res => {
        console.log("VM Started!!!")
      }, err => {
        console.log("Could not start: " + err)
      }
    )
  }
}
