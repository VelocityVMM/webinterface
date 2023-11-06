import { Component, Input, OnInit } from '@angular/core';
import { Group } from '../classes/group';
import { VelocityService } from '../services/velocity.service';
import { Flowbite } from '../flowbitefix/flowbitefix';
import { Pool } from '../classes/media';

@Component({
  selector: 'app-mediaupload',
  templateUrl: './mediaupload.component.html',
  styleUrls: ['./mediaupload.component.scss']
})
@Flowbite()
export class MediauploadComponent implements OnInit {

  @Input() group_id?: number;
  public group?: Group;
  public pools?: Pool[];

  constructor(private vs: VelocityService) { }

  ngOnInit(): void {
    // Fetch group information
    this.vs.get_grouplist().subscribe({
      next: (v) => {
        for(let group of v.groups) {
          if(group.gid == this.group_id) {
            this.group = group
          }
        }
      }
    })

    this.vs.get_poollist(this.group_id!).subscribe({
      next: (v) => {
        this.pools = v;
      }
    })
  }
}
