import { Injectable } from "@angular/core";
import axios from 'axios';
import { Purchase } from "../models/purchase.models";
import { invoice } from "../models/invoice.models";



@Injectable({
  providedIn: 'root',
})

export class PurchaseService {
    private apiUrl = 'http://localhost:3001';
    
    constructor() {}
    
    async getPurchases(): Promise<Purchase[]> {
        try {
        const response = await axios.get(`${this.apiUrl}/invoice`);
        console.log('Purchases:', response.data);
        return response.data.invoices;

        } catch (error) {
        console.error('Error getting the purchases:', error);
        throw error;
        }
    }
    
    async createPurchase(invoice: invoice): Promise<Purchase> {
        try {
        const response = await axios.post(`${this.apiUrl}/invoice/buy-ticket`, invoice);
        console.log('Purchase created:', response.data);
        return response.data.invoice;

        } catch (error) {
        console.error('Error creating the purchase:', error);
        throw error;
        }
    }

}