import { CartItem } from "../domain/Cart";

export interface PricingStrategy {
  calculateTotalCents(items: CartItem[]): number;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}

export interface PaymentProcessor {
  pay(amountCents: number, paymentMethodToken: string): Promise<PaymentResult>;
}

export interface InventoryService {
  isInStock(productId: string, quantity: number): Promise<boolean>;
  reserve(productId: string, quantity: number): Promise<void>;
}

export interface NotificationService {
  send(to: string, message: string): Promise<void>;
}
