import { Component } from '@angular/core';
import { Group, parse_flat_to_tree } from 'src/app/classes/group';
import { Flowbite } from 'src/app/flowbitefix/flowbitefix';
import { VelocityService } from 'src/app/services/velocity.service';

@Component({
  selector: 'app-groupview',
  templateUrl: './groupview.component.html',
  styleUrls: ['./groupview.component.scss']
})
@Flowbite()
export class GroupviewComponent {

  public root_group?: Group;

  constructor(private vs: VelocityService) {
    this.fetch()
  }

  fetch() {
    this.vs.get_grouplist().then(
      res => {
        // TODO: Rewrite parse_flat_to_tree!
        this.root_group = parse_flat_to_tree(res.groups)
      }
    ).catch(err => { })
  }
}
