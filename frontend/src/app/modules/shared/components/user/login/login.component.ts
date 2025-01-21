import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/users.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private userService = inject(UserService);
  
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
        this.userService.changeIsAdministrator(user.isAdmin)
        localStorage.setItem('user', JSON.stringify(user));
        if (user.isAdmin) {
          window.location.href = '/admin';
          console.log('Administrator logged in');
        }else{
          window.location.href = '/';
        }

      })
      .catch((error) => {
        console.error('Login failed:', error.message);
       });
  }


}
