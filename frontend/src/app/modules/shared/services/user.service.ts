import { computed, Injectable, signal } from '@angular/core';
import axios from 'axios';
import { User } from '../models/users.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3001'; 

  constructor() {}

  loginActive = signal(false);
  public loginActiveValue = computed(() => this.loginActive());

  registerActive = signal(false);
  public registerActiveValue = computed(() => this.registerActive());

  currentUser = signal<User | null>(null); 
  public currentUserValue = computed(() => this.currentUser());

  changeLoginActive() {
    this.loginActive.set(!this.loginActive());
  }

  changeCurrentUser(user: User) {
      this.currentUser.set(user);
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
    console.log('Logging in user:', email);
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
  
      return user;
  
    } catch (error: any) {
      console.error('Error during login:', error.response?.data || error.message);
      throw new Error(error.response?.data || 'Error during login');
    }finally{
      console.log('holaaaaaaa');
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

   async getUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/users`);
      return response.data;  
    } catch (error) {
      console.error('Error getting the users:', error);
      throw error;  
    }
   }

   async updateUserAvailability(id: number, available: boolean): Promise<string> {
    try {
      const response = await axios.put(`${this.apiUrl}/users/available`, {
        id,
        available,
      });
      console.log('User availability updated:', response.data);
      return response.data; // Retorna el mensaje de éxito
    } catch (error: any) {
      console.error(
        'Error while updating user availability:',
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data || 'Error while updating user availability'
      );
    }
  }




}
