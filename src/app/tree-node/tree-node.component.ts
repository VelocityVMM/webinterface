import { Component, Input, OnInit } from '@angular/core';
import { Group, parse_flat_to_tree } from '../classes/group';
import { VelocityService } from '../services/velocity.service';
import { Flowbite } from '../flowbitefix/flowbitefix';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../notification/notification.component';
import { NgForm } from '@angular/forms';
import { Pool } from '../classes/media';
import { LoginService } from '../services/login.service';
import { UserInfo } from '../classes/user';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
@Flowbite()
export class TreeNodeComponent implements OnInit {

  @Input() node?: Group;
  public media_pools?: Pool[] = [ ];
  public active: boolean = true;

  constructor(private vs: VelocityService, private ls: LoginService, private nf: NotificationService) { }

  ngOnInit(): void {
    // Wait until user is set.
    if(this.ls.get_user() == undefined) {
      this.ls.user_set.subscribe({
        next: () => {
          this.fetch_mediapools_observable().subscribe({
            next: (v) => {
              this.media_pools = v
            }
          })
        }
      })
    } else {
      this.fetch_mediapools_observable().subscribe({
        next: (v) => {
          this.media_pools = v
        }
      })
    }
  }


  fetch_mediapools_observable() {
    return new Observable<any>((observer) => {
      // Get memberships
      let user: UserInfo = this.ls.get_user()!
      parse_flat_to_tree(user.memberships);

      // result array
      let pools: Pool[] = [ ]

      // All observables
      let observables: Observable<any>[] = [];

      for(let membership of user.memberships) {
        // Check if we are allowed to list the pools
        if(membership.has_permission("velocity.pool.list")) {
          let observable = this.vs.get_poollist(membership.gid)
          observables.push(observable)
        }
      }

      // Await all observables
      forkJoin(observables).subscribe(results => {
        // Iterate through all results
        for(let result of results) {
          
          // Iterate through every pool of the result
          for(let fetched_pool of result) {

            let add: boolean = true;

            // Check if we already have this pool..
            for(let pool of pools) {
              if(pool.mpid == fetched_pool.mpid) {
                add = false;
              }
            }

            if(add) {
              pools.push(fetched_pool)
            }
          }
        }
        // Got all pools, complete observable.
        observer.next(pools)
        observer.complete()
      })
    })
  }

  add_node(form: NgForm) {
    // Really ugly hack, but this seems to be a common issue..
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    const groupname = form.form.value.groupname
    this.vs.add_subgroup(groupname, this.node?.gid ?? 0).subscribe({
      next: (v) => {
        this.vs.group_tree_changed.emit('tree_changed')
        this.nf.send_notification(NotificationType.SUCCESS, "Group added.")
      }, error: (e) => {
        this.nf.send_notification(NotificationType.ERROR, e.error.message ?? "Could not add group.")
      }
    })

    form.reset()
  }

  delete_node() {
    this.vs.delete_group(this.node?.gid ?? 0).subscribe({
      next: (v) => {
        this.vs.group_tree_changed.emit('tree_changed')
        this.nf.send_notification(NotificationType.SUCCESS, "Group deleted.")
      }, error: (e) => {
        this.nf.send_notification(NotificationType.ERROR, e.error.message ?? "Could not delete group.")
      }
    })
  }
}
