import { Component } from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PopupService} from '../../shared/libs/lib-angular/services/popup.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    MatCard,
    MatIconButton,
    MatSuffix,
    MatIcon,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showPassword: boolean = false;
  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService,
              private router: Router,
              private popupService: PopupService) {
  }

  login() {
    if (!this.form.valid) {
      return
    }

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.router.navigate(["/admin"]).then();
      },
      error: (err) => {
          this.popupService.openSnackBar(`Erro ao efetuar login: ${err.message}`, {type: 'error'});
      }
    })
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
