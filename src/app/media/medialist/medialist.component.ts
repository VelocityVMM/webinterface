import { Component, OnInit } from '@angular/core';
import { VelocityService } from 'src/app/services/velocity.service';

@Component({
  selector: 'app-medialist',
  templateUrl: './medialist.component.html',
  styleUrls: ['./medialist.component.scss']
})
export class MedialistComponent implements OnInit {

  medialists = new Map();
  constructor(private vs: VelocityService) { }


  ngOnInit(): void {
    this.vs.get_user_medialists().then(
      res => {
        this.medialists = res;
    })
  }
}
