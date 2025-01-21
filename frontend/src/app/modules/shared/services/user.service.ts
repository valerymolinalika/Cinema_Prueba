import { computed, Injectable, signal } from '@angular/core';
import axios from 'axios';
import { User } from '../models/users.models';
import { Administrator } from '../models/admin.models';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = 'http://localhost:3001';

    constructor() { }

    loginActive = signal(false);
    public loginActiveValue = computed(() => this.loginActive());

    registerActive = signal(false);
    public registerActiveValue = computed(() => this.registerActive());

    currentUser = signal<User | null | Administrator>(null);
    isAdministrator = signal(false);
    public isAdministratorValue = computed(() => this.isAdministrator());
    public currentUserValue = computed(() => this.currentUser());

    changeLoginActive() {
        this.loginActive.set(!this.loginActive());
    }

    changeCurrentUser(user: User | Administrator) {
        if (this.currentUser()) {
            return
        }
        this.currentUser.set(user);
    }

    changeIsAdministrator(isAdmin: boolean | undefined ) {
        if (isAdmin) {
            this.isAdministrator.set(isAdmin);
        }
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

    async loginUser(email: string, user_password: string): Promise<User | Administrator> {
        console.log('Logging in user:', email);
        try {
            const response = await axios.post(`${this.apiUrl}/users/login`, {
                email,
                user_password,
            });
    
            console.log('User logged in:', response.data);
    
            const { isAdmin, ...userData } = response.data;
            
            if (isAdmin) {
                const admin: Administrator = {
                    id: userData.id,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    email: userData.email,
                    user_password: userData.user_password,
                    isAdmin: isAdmin,
                };
                this.currentUser.set(admin); // Guarda al administrador como el usuario actual
                console.log(this.isAdministrator());
                return admin;
            } else {
                const user: User = {
                    id: userData.id,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    email: userData.email,
                    phone: userData.phone,
                    available: userData.available,
                    user_password: userData.user_password,
                    isAdmin: isAdmin,
                };
                this.currentUser.set(user); // Guarda al usuario como el usuario actual
                return user;
            }
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
        const rawCurrentUser = localStorage.getItem('user');
        const localStorageUser = rawCurrentUser?JSON.parse(rawCurrentUser):null;
        return localStorageUser
        // return this.currentUser();
    }

    logoutUser() {
        localStorage.clear();
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
