import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/users.models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private userService = inject(UserService);
  private router = inject(Router);

  setLogin() {
    this.userService.changeLoginActive();
  }

  setRegister() {
    this.userService.changeRegisterActive();
  }

  email = signal("")
  password = signal('')

  changeEmail(event: Event) {
    const input = event.target as HTMLInputElement
    this.email.set(input.value)
  }

  changePassword(event: Event) {
    const input = event.target as HTMLInputElement
    this.password.set(input.value)
  }

  login() {
    this.userService
      .loginUser(this.email(), this.password())
      .then((user) => {
        this.userService.changeCurrentUser(user)
        console.log("currentUser", this.userService.getCurrentUser())
        console.log('Login successful!');
        this.userService.changeLoginActive();
        this.userService.changeIsAdministrator(user.isAdmin)
        // this.userService.loginActive.set(false)
        console.log("isLoginActive", this.userService.getLoginActive())
        if (user.isAdmin) {
          this.userService.changeLoginActive();
          this.router.navigate(['/admin']);
        }

      })
      .catch((error) => {
        console.error('Login failed:', error.message);
      });
  }


}
