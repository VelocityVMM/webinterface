import { Component, Input } from '@angular/core';
import { Flowbite } from 'src/app/flowbitefix/flowbitefix';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
@Flowbite()
export class ModalComponent {
  // The ID this modal will have
  @Input() uid?: string;

  // Title of the modal
  @Input() title?: string;

  // normal, large
  @Input() size?: string = "normal";

  get_classes() {
    switch(this.size) {
      case "large": {
        return "relative w-full max-w-5xl max-h-full";
      }
      case "normal": {
        return "relative w-full max-w-2xl max-h-full";
      }
      default: {
        return "";
      }
    }
  }
}
