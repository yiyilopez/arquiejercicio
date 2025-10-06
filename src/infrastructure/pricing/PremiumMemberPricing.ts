import { CartItem } from "../../domain/Cart";
import { PricingStrategy } from "../../application/ports";

// OCP/LSP: Alternative implementation interchangeable with SimplePricing
export class PremiumMemberPricing implements PricingStrategy {
  constructor(private baseTaxRate: number = 0.21) {}

  calculateTotalCents(items: CartItem[]): number {
    const subtotal = items.reduce((sum, i) => sum + i.product.priceCents * i.quantity, 0);
    const memberDiscount = subtotal * 0.1; // flat 10% for members
    const taxed = (subtotal - memberDiscount) * (1 + this.baseTaxRate * 0.8); // 20% off taxes as a perk
    return Math.round(taxed);
  }
}
