import { computed, Injectable, signal } from '@angular/core';
import axios from 'axios';
import { User } from '../models/users.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3001'; // Ajusta según corresponda

  constructor() {}

  loginActive = signal(false);
  public loginActiveValue = computed(() => this.loginActive());

  registerActive = signal(false);
  public registerActiveValue = computed(() => this.registerActive());

  private currentUser = signal<User | null>(null); // Estado del usuario actual
  public currentUserValue = computed(() => this.currentUser());

  changeLoginActive() {
    this.loginActive.set(!this.loginActive());
  }

  getLoginActive() {
    return this.loginActive();
  }

  changeRegisterActive() {
    this.registerActive.set(!this.registerActive());
  }

  getRegisterActive() {
    return this.registerActive();
  }

  async loginUser(email: string, user_password: string): Promise<User> {
    try {
      const response = await axios.post(`${this.apiUrl}/users/login`, {
        email,
        user_password,
      });
  
      console.log('User logged in:', response.data);
  
      const user: User = response.data;
      if (user) {
        this.currentUser.set(user); 
      } else {
        throw new Error('Invalid user data received');
      }
  
      this.changeLoginActive(); 
      return user;
  
    } catch (error: any) {
      console.error('Error during login:', error.response?.data || error.message);
      throw new Error(error.response?.data || 'Error during login');
    }
  }
  

  async registerUser(user: User): Promise<User> {
    try {
        const response = await axios.post(`${this.apiUrl}//users/register`, user);
        console.log('User registered:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error during registration:', error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error during registration');
    }
}

  getCurrentUser() {
    return this.currentUser();
  }

  logoutUser() {
    this.currentUser.set(null);
  }
}
