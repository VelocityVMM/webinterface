import { Component, Input } from '@angular/core';
import { Flowbite } from 'src/app/flowbitefix/flowbitefix';

@Component({
  selector: 'app-modalbutton',
  templateUrl: './modalbutton.component.html',
  styleUrls: ['./modalbutton.component.scss']
})
@Flowbite()
export class ModalbuttonComponent {

  // Modal uid
  @Input() uid?: string;

  // Button text
  @Input() text?: string;

  // The style: (button or link)
  @Input() bstyle?: string;

}
