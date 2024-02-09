import { Component } from '@angular/core';

@Component({
  selector: 'app-createvm',
  templateUrl: './createvm.component.html',
  styleUrls: ['./createvm.component.scss']
})
export class CreatevmComponent {

  public step: number = 0;

  cpu_slider?: any = 4;
  mem_slider?: any = 4096;

  next() {
    this.step++;
  }

  previous() {
    this.step--;
  }

}
