import { CartItem } from "../../domain/Cart";
import { PricingStrategy } from "../../application/ports";

// SRP: Only concerned with price calculation
export class SimplePricing implements PricingStrategy {
  constructor(private taxRate: number = 0.21, private discountThresholdCents = 5000, private discountRate = 0.05) {}

  calculateTotalCents(items: CartItem[]): number {
    const subtotal = items.reduce((sum, i) => sum + i.product.priceCents * i.quantity, 0);
    const discount = subtotal >= this.discountThresholdCents ? subtotal * this.discountRate : 0;
    const taxed = (subtotal - discount) * (1 + this.taxRate);
    return Math.round(taxed);
  }
}
