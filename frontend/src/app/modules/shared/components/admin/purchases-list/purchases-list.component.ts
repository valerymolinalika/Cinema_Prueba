import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { PurchaseService } from '../../../services/purchase.service';
import { Purchase } from '../../../models/purchase.model';

@Component({
  selector: 'app-purchases-list',
  imports: [CommonModule],
  templateUrl: './purchases-list.component.html',
  styleUrl: './purchases-list.component.css'
})
export class PurchasesListComponent {

  purchaseService = inject(PurchaseService);
  purchases = signal<Purchase[]>([]);

  ngOnInit() {
    this.getPurchases();
  }

  private async getPurchases() {
    this.purchaseService.getPurchases()
      .then((purchases) => {
        this.purchases.set(purchases);
      });
  }

}
