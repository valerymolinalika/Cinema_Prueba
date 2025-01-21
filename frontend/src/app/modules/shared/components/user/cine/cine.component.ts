
import { Component, Input, SimpleChange, SimpleChanges, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { PurchaseService } from '../../../services/purchase.service';
import { Invoice } from '../../../models/invoice.models';

@Component({
  selector: 'app-cine',
  templateUrl: './cine.component.html',
  styleUrls: ['./cine.component.css'],
  standalone: true,
  imports: [FormsModule, RouterLink]
})
export class CineComponent {
  @Input({ required: true }) inputRows: number = 4;
  @Input({ required: true }) inputCols: number = 4;
  @Input({ required: true }) inputAvailableSeats: string[] = [];
  @Input({required: true})   inputMovieId: string = "";
  @ViewChild('paymentForm') paymentForm!: NgForm;


  // Seats signals
  rows = signal(this.inputRows);
  cols = signal(this.inputCols);
  availableSeats = signal(1);
  availableSeatsList = signal(this.inputAvailableSeats);
  selectedSeats = signal<Set<string>>(new Set());
  maxSeats = computed(() => this.rows() * this.cols());
  showMaxSeatsError = signal(false);
  showSeatsError = signal(false);
  showLogginError = signal(false);

  // Payment signals
  showPaymentModal = signal(false);
  showSuccessModal = signal(false);
  cardNumber = signal('');
  expirationDate = signal('');
  cvv = signal('');
  formSubmitted = signal(false);

  // Computed
  selectedSeatsCount = computed(() => this.selectedSeats().size);
  availableSeatsCount = computed(() => this.availableSeatsList().length);

  userService = inject(UserService); 
  userExists = computed(() => {
        const user = this.userService.getCurrentUser();
        console.log('Header computed userExists:', !!user?.first_name);
        return !!user?.first_name;
    });

  purchaseService = inject(PurchaseService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputRows']) {
      this.rows.set(this.inputRows);
    }
    if (changes['inputCols']) {
      this.cols.set(this.inputCols);
    }
    if (changes['inputAvailableSeats']) {
      this.availableSeatsList.set(this.inputAvailableSeats);
    }
  }

  // Seats
  generateArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  generateLetters(n: number): string[] {
    return Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
  }

  selectSeat(row: number, col: number): void {
    if (this.isSeatUnavailable(row, col)) {
      return
    }

    const seatId = `${row}-${col}`;
    const currentSeats = new Set(this.selectedSeats());

    if (this.isSelected(row, col)) {
      currentSeats.delete(seatId);
      this.selectedSeats.set(currentSeats);

      return
    }

    if (this.canSelectMoreSeats()) {
      currentSeats.add(seatId);
      this.selectedSeats.set(currentSeats);
    }
  }

  isSelected(row: number, col: number): boolean {
    return this.selectedSeats().has(`${row}-${col}`);
  }

  canSelectMoreSeats(): boolean {
    return this.selectedSeatsCount() < this.availableSeats();
  }

  validateSeatsInput(): void {
    this.showMaxSeatsError.set(
      this.availableSeats() > this.availableSeatsCount()
    );
    this.selectedSeats.set(new Set());
  }

  getFormattedSeats(): string[] {
    return Array.from(this.selectedSeats()).map(seatId => {
      const [row, col] = seatId.split('-');
      return `${this.generateLetters(this.rows())[parseInt(row)]}${parseInt(col) + 1}`
    });
  }

  // Payment
  // Payment
openPaymentModal(): void {
  if (!this.userExists()) {
    this.showLogginError.set(true);
    setTimeout(() => this.showLogginError.set(false), 3000); 
    return;
  }

  if (this.selectedSeatsCount() !== this.availableSeats()) {
    this.showSeatsError.set(true);
    return;
  }

  this.showSeatsError.set(false);
  this.showPaymentModal.set(true);
}


  closePaymentModal(): void {
    this.showPaymentModal.set(false);
    this.resetForm();
  }

  async processPayment() {
    this.formSubmitted.set(true);
    if (!this.paymentForm.valid) {
      return
    }
    try {
      const currentUser = this.userService.getCurrentUser();
      if (!currentUser) {
        return;
      }
      const invoice: Invoice = {
        user_id: currentUser.id,
        function_id: this.inputMovieId, 
        seats: this.getFormattedSeats(),
        price_per_ticket: '20000', 
      };

      const purchase = await this.purchaseService.createPurchase(invoice);
      console.log('Purchase successful:', purchase);

      this.showPaymentModal.set(false);
      this.showSuccessModal.set(true);
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  }
    

  resetForm(): void {
    this.cardNumber.set('');
    this.expirationDate.set('');
    this.cvv.set('');
    this.formSubmitted.set(false);
    this.selectedSeats.set(new Set());
    this.availableSeats.set(1);
  }

  // Form
  formatExpirationDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }

    this.expirationDate.set(value);
  }

  onlyNumbers(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  isSeatUnavailable(row: number, col: number): boolean {
    const seatId = `${this.generateLetters(this.rows())[row]}${col + 1}`;
    return !this.availableSeatsList().includes(seatId);
  }

 

}