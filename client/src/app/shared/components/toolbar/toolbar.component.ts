import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {IUser} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'toolbar',
  standalone: true,
  imports: [
    MatToolbar,
    RouterLink,
    RouterLinkActive,
    MatButton,
    NgOptimizedImage,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  protected user: IUser

  constructor(private router: Router, private authService: AuthService) {
    this.user = this.authService.user;
  }

  async logout() {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }
}
