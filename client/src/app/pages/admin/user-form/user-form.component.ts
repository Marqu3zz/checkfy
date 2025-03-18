import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../shared/services/user.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {MatOption, MatSelect} from '@angular/material/select';
import {IUser} from '../../../shared/models/user.model';
import {PopupService} from '../../../shared/libs/lib-angular/services/popup.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatCheckbox,
    MatButton,
    MatSelect,
    MatOption
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
    @Input() id: string;

    form = new FormGroup({
        name: new FormControl<string>(null, [Validators.required]),
        email: new FormControl<string>(null, [Validators.required]),
        password: new FormControl<string>(null),
        permission: new FormControl(null, [Validators.required]),
        active: new FormControl<boolean>(true),
    })

    constructor(private userService: UserService,
                private popupService: PopupService) {
    }

    ngOnInit() {
        if (this.id !== 'new') {
            this.userService.getById(this.id).subscribe({
                next: async (value) => {
                    this.form.patchValue(value)
                }
            });
        }
    }

    save() {
        this.userService.createOrUpdate(this.form.getRawValue() as IUser).subscribe({
            next: (value: IUser) => {
                if (this.id !== 'new') {
                    this.popupService.openSnackBar(`Usuário ${value.name} atualizado com sucesso.`, {type: 'success'});
                } else {
                  this.popupService.openSnackBar(`Usuário ${value.name} cadastrado com sucesso.`, {type: 'success'});
                }

            },
            error: (error) => {
                if (this.id !== 'new') {
                  this.popupService.openSnackBar(`Erro ao atualizar usuário: ${error.message}`, {type: 'error'});
                } else {
                  this.popupService.openSnackBar(`Erro ao cadastrar usuário: ${error.message}`, {type: 'error'});
                }
            }
        });
    }
}
