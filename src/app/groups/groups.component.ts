import { Component, OnInit } from '@angular/core';
import { VelocityService } from '../services/velocity.service';
import { Group, parse_flat_to_tree } from '../classes/group';
import { Flowbite } from '../flowbitefix/flowbitefix';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
@Flowbite()
export class GroupsComponent implements OnInit {

  public root_node?: Group;

  constructor(private vs: VelocityService) { }
  
  ngOnInit(): void {
    this.update()

    // update if the tree is changed
    this.vs.group_tree_changed.subscribe({
      next: (v: any) => {
        this.update()
      }
    })
  }

  update() {
    this.vs.get_grouplist().subscribe({
      next: (v) => {
        console.log(v)
        this.root_node = parse_flat_to_tree(v.groups)
      },
      error: (e) => {}
     })
  }
}
