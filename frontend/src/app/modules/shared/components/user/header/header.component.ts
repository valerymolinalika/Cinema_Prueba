import { Component, computed, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {

  ngOnInit() {
    console.log('Current user:', this.currentUser());
  }

  private userService = inject(UserService);

  currentUser = computed(() => this.userService.currentUserValue());

  setLogin() {
    this.userService.changeLoginActive();
  }

  setRegister() {
    this.userService.changeRegisterActive();
  }

  logout() {
    this.userService.logoutUser();
  }
}
