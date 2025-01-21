import { Component, computed, effect, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '@user/login/login.component';
import { RegisterComponent } from '@user/register/register.component';
import { RouterLink } from '@angular/router';

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
  }

  private userService = inject(UserService);

  currentUser = this.userService.currentUserValue()

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
  }
}
