import { Component, computed, effect, inject } from '@angular/core';
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

  ngOnInit() {
    console.log('Current user:', this.currentUser);
    const userInfo = localStorage.getItem('user');
    let localStorageUser: User | Administrator
    console.log('User info:', userInfo);
    
    if (userInfo) {
      localStorageUser = JSON.parse(userInfo);
      console.log('Local storage user:', localStorageUser);
    }
    
  }

  private userService = inject(UserService);

  currentUser = localStorage.getItem('user');

  localStorageUser = this.currentUser?JSON.parse(this.currentUser):{firstname:"JoseMalo"};

  userExists = computed(() => this.userService.getCurrentUser() !== null && this.userService.getCurrentUser()?.first_name !== "")

  currentUserValue = computed(() => this.userService.getCurrentUser())

  constructor() {
      // Efecto para mostrar el modal de login
      effect(() => {
        this.showLogin = this.userService.getLoginActive();
      });
  
      // Efecto para mostrar el modal de registro
      effect(() => {
        this.showRegister = this.userService.getRegisterActive();
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
    console.log('Current user:', this.userService.getCurrentUser());
    window.location.href = '/';
  }
}
