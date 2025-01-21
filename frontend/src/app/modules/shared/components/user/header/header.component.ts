import { Component, computed, effect, inject, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '@user/login/login.component';
import { RegisterComponent } from '@user/register/register.component';
import { RouterLink } from '@angular/router';
import { User } from '../../../models/users.models';
import { Administrator } from '../../../models/admin.models';

@Component({
  selector: 'app-user-header',
  imports: [CommonModule, RouterLink, LoginComponent,RegisterComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  
  showLogin = false;
  showRegister = false;

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  userExists = computed(() => {
    const user = this.userService.getCurrentUser();
    console.log('Header computed userExists:', !!user?.first_name);
    return !!user?.first_name;
  });

  currentUserValue = computed(() => {
    const user = this.userService.getCurrentUser();
    console.log('Header computed currentUserValue:', user);
    return user;
  });

  constructor() {
    effect(() => {
      this.showLogin = this.userService.getLoginActive();
      this.cdr.detectChanges();
    });

    effect(() => {
      this.showRegister = this.userService.getRegisterActive();
      this.cdr.detectChanges();
    });
  }

  setLogin() {
    this.userService.changeLoginActive();
  }

  setRegister() {
    this.userService.changeRegisterActive();
  }

  logout() {
    this.userService.logoutUser();
    console.log('Logout successful!');
    this.cdr.detectChanges();
    window.location.href = '/';
  }
}
