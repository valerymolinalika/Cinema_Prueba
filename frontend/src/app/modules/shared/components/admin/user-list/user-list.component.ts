import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/users.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  userService = inject(UserService);
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null); 
  showModal = signal(false); 
  searchQuery: string = '';
  filteredUsers = signal<User[]>([])

  ngOnInit() {
    this.getUsers();
  }

  private async getUsers() {
    this.userService.getUsers().then((users) => {
      this.users.set(users);
      this.filteredUsers.set(users);
    });
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase().trim(); 
    if (!query) {
      this.filteredUsers.set(this.users()); 
    } else {
      const filtered = this.users().filter((user) =>
        user.first_name.toLowerCase().includes(query) 
      );
      this.filteredUsers.set(filtered); 
    }
  }

  async toggleAvailability(user: User) {
    this.selectedUser.set(user);
    this.showModal.set(true); // Mostrar el modal
  }

  async confirmChangeAvailability() {
    const user = this.selectedUser();
    if (user) {
      try {
        const updatedAvailability = !user.available; 
        await this.userService.updateUserAvailability(user.id, updatedAvailability);
        this.getUsers(); // Actualizar lista de usuarios
        this.closeModal();
      } catch (error) {
        console.error('Error updating availability:', error);
      }
    }
  }

  closeModal() {
    this.showModal.set(false); // Ocultar modal
    this.selectedUser.set(null); // Reiniciar usuario seleccionado
  }
}
