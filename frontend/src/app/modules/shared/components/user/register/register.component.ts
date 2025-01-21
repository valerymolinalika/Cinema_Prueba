import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/users.models';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private userService = inject(UserService);

  id = signal('')
  first_name = signal('')
  last_name = signal('')
  email = signal("")
  phone = signal('')
  password = signal('')

  setLogin() {
    this.userService.changeLoginActive();
  }
  
  setRegister() {
    this.userService.changeRegisterActive();
  }


  changeId(event: Event) {
    const input = event.target as HTMLInputElement
    this.id.set(input.value)
  }
  changeEmail(event: Event) {
    const input = event.target as HTMLInputElement
    this.email.set(input.value)
  }

  changePassword(event: Event) {
    const input = event.target as HTMLInputElement
    this.password.set(input.value)
  }

  changeFirstName(event: Event) {
    const input = event.target as HTMLInputElement
    this.first_name.set(input.value)
  }

  changeLastName(event: Event) {
    const input = event.target as HTMLInputElement
    this.last_name.set(input.value)
  }

  changePhone(event: Event) {
    const input = event.target as HTMLInputElement
    this.phone.set(input.value)
  }


  register() {
    const user: User = {
      id: parseInt(this.id()),
      first_name: this.first_name(),
      last_name: this.last_name(),
      email: this.email(),
      available: true,
      phone: this.phone(),
      user_password: this.password()
    }
    console.log("holaaaa" + user)
    this.userService.registerUser(user)
  }

}
