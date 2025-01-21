import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserListComponent } from '../../../shared/components/admin/user-list/user-list.component';
import { MoviesListComponent } from '../../../shared/components/admin/movies-list/movies-list.component';
import { PurchasesListComponent } from '../../../shared/components/admin/purchases-list/purchases-list.component';

@Component({
  selector: 'app-admin',
  imports: [CommonModule,RouterModule,UserListComponent, MoviesListComponent, PurchasesListComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  activeTab: string = 'users';
}
