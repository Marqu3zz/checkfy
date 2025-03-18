import {Component, Input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-active',
  standalone: true,
  imports: [
    MatIcon,
    MatTooltip
  ],
  templateUrl: './active.component.html',
  styleUrl: './active.component.scss'
})
export class ActiveComponent {
  @Input() value: { active: boolean };
  @Input() extraData: any;

  getIcon() {
    return this.value.active ? 'check_circle_outline' : 'error_circle_outline';
  }

}
