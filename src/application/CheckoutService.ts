import { Cart } from "../domain/Cart";
import { InventoryService, NotificationService, PaymentProcessor, PricingStrategy } from "./ports";

export interface CheckoutRequest {
  cart: Cart;
  customerEmail: string;
  paymentMethodToken: string;
}

export interface CheckoutResponse {
  totalCents: number;
  transactionId: string;
}

// SRP: Coordinates checkout only. DIP: depends on abstractions.
export class CheckoutService {
  constructor(
    private pricing: PricingStrategy,
    private payment: PaymentProcessor,
    private inventory: InventoryService,
    private notifier: NotificationService
  ) {}

  async checkout(req: CheckoutRequest): Promise<CheckoutResponse> {
    const items = req.cart.getItems();
    if (items.length === 0) throw new Error("Cart is empty");

    // Ensure stock
    for (const i of items) {
      const ok = await this.inventory.isInStock(i.product.id, i.quantity);
      if (!ok) throw new Error(`Out of stock: ${i.product.name}`);
    }

    const total = this.pricing.calculateTotalCents(items);

    const result = await this.payment.pay(total, req.paymentMethodToken);
    if (!result.success || !result.transactionId) {
      throw new Error(result.errorMessage || "Payment failed");
    }

    // Reserve after successful payment to avoid holding stock unnecessarily in the demo
    for (const i of items) {
      await this.inventory.reserve(i.product.id, i.quantity);
    }

    await this.notifier.send(
      req.customerEmail,
      `Gracias por tu compra. Total: ${(total / 100).toFixed(2)}€. Transacción: ${result.transactionId}`
    );

    return { totalCents: total, transactionId: result.transactionId };
  }
}
