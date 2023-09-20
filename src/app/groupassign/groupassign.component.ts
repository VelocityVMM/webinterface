import { Component, Input, OnInit, Output } from '@angular/core';
import { Group, parse_flat_to_tree } from '../classes/group';
import { VelocityService } from '../services/velocity.service';
import { User } from '../classes/user';

@Component({
  selector: 'app-groupassign',
  templateUrl: './groupassign.component.html',
  styleUrls: ['./groupassign.component.scss']
})
export class GroupassignComponent implements OnInit {

  public groups?: Group[];
  @Input() user?: User;
  selected_group?: Group;

  constructor(private vs: VelocityService) { }

  ngOnInit(): void {
    this.vs.get_grouplist().subscribe({
      next: (v) => {
        this.groups = v.groups;
        parse_flat_to_tree(this.groups)
        this.selected_group = this.groups![0]
      }
    })
  }
  
  set_group(group?: Group) {
    this.selected_group = group;
  }

  get_group_height(): number | undefined {
    const group_height = document.getElementById("tab_button_container-" + this.user?.uid)?.offsetHeight

    if(group_height! < 300) {
      return document.documentElement.clientHeight / 2
    }    

    return group_height
  }
}
