import { Component, Input } from '@angular/core';
import { Group, parse_flat_to_tree } from 'src/app/classes/group';
import { User } from 'src/app/classes/user';
import { VelocityService } from 'src/app/services/velocity.service';

@Component({
  selector: 'app-groupedit',
  templateUrl: './groupedit.component.html',
  styleUrls: ['./groupedit.component.scss']
})
export class GroupeditComponent {

  @Input() users?: User[];
  public groups?: Group[];
  selected_group?: Group;

  constructor(private vs: VelocityService) { }

  ngOnInit(): void {
    this.vs.get_grouplist().then(
      res => {
        this.groups = res.groups;
        parse_flat_to_tree(this.groups);
        this.selected_group = this.groups![0];
      }
    )
  }
  
  set_group(group?: Group) {
    this.selected_group = group;
  }

}
