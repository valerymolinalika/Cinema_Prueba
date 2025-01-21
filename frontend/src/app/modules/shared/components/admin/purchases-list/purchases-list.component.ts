import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { PurchaseService } from '../../../services/purchase.service';
import { Purchase } from '../../../models/purchase.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchases-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './purchases-list.component.html',
  styleUrl: './purchases-list.component.css',
})
export class PurchasesListComponent {
  purchaseService = inject(PurchaseService);
  purchases = signal<Purchase[]>([]);
  filteredPurchases = signal<Purchase[]>([]);
  searchQuery = '';

  ngOnInit() {
    this.getPurchases();
  }

  private async getPurchases() {
    this.purchaseService.getPurchases().then((purchases) => {
      this.purchases.set(purchases);
      this.filteredPurchases.set(purchases);
    });
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPurchases.set(
      this.purchases().filter(
        (purchase) =>
          purchase.user_name.toLowerCase().includes(query) ||
          purchase.movie_title.toLowerCase().includes(query)
      )
    );
  }
  
}
