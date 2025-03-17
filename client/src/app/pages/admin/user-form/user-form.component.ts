import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../shared/services/user.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton, MatMiniFabButton} from '@angular/material/button';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatCheckbox,
    MatMiniFabButton,
    MatButton
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
    @Input() id: string;

    form = new FormGroup({
        name: new FormControl<string>(null, [Validators.required]),
        email: new FormControl<string>(null, [Validators.required]),
        password: new FormControl<string>(null, [Validators.required]),
        active: new FormControl<boolean>(null),
    })

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        if (this.id !== 'new') {
            this.userService.getById(this.id).subscribe({
                next: async (value) => {
                    this.form.patchValue(value)
                }
            })
        }
    }
}
