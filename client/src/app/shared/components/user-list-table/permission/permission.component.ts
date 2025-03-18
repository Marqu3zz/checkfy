import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.scss'
})
export class PermissionComponent {
  @Input() value: { permission: string };
  @Input() extraData: any;

  getText(): string {
    const permission  = {
      'ADMIN': 'Administrador',
      'OPERATION': 'Operador'
    }

    return permission[this.value.permission];
  }
}
