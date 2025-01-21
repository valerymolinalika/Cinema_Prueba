import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/users.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  userService = inject(UserService);
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null); // Usuario seleccionado para cambiar disponibilidad
  showModal = signal(false); // Estado del modal

  ngOnInit() {
    this.getUsers();
  }

  private async getUsers() {
    this.userService.getUsers().then((users) => {
      this.users.set(users);
    });
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
