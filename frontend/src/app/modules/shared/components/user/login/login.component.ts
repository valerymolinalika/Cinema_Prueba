import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [],
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
      .then(() => {
        console.log('Login successful!');
      })
      .catch((error) => {
        console.error('Login failed:', error.message);
        alert('Login failed. Please check your credentials.');
      });
  }
  

}
