import { Cart } from "./domain/Cart";
import { Product } from "./domain/Product";
import { SimplePricing } from "./infrastructure/pricing/SimplePricing";
import { PremiumMemberPricing } from "./infrastructure/pricing/PremiumMemberPricing";
import { InMemoryInventory } from "./infrastructure/inventory/InMemoryInventory";
import { FakePaymentProcessor } from "./infrastructure/payment/FakePaymentProcessor";
import { ConsoleNotification } from "./infrastructure/notification/ConsoleNotification";
import { CheckoutService } from "./application/CheckoutService";

async function main() {
  const coffee: Product = { id: "p1", name: "Café en grano 1kg", priceCents: 1499 };
  const mug: Product = { id: "p2", name: "Taza cerámica", priceCents: 999 };

  const cart = new Cart();
  cart.addItem(coffee, 2);
  cart.addItem(mug, 1);

  const inventory = new InMemoryInventory({ p1: 10, p2: 5 });
  const notifier = new ConsoleNotification();
  const payment = new FakePaymentProcessor(false);

  // Try with SimplePricing
  const simplePricing = new SimplePricing(0.21, 2000, 0.05);
  const checkout1 = new CheckoutService(simplePricing, payment, inventory, notifier);
  const res1 = await checkout1.checkout({ cart, customerEmail: "user@example.com", paymentMethodToken: "tok_visa" });
  console.log("Checkout con SimplePricing:", res1);

  // Try with PremiumMemberPricing (LSP: interchangeability)
  const cart2 = new Cart();
  cart2.addItem(coffee, 1);
  cart2.addItem(mug, 2);
  const premiumPricing = new PremiumMemberPricing(0.21);
  const checkout2 = new CheckoutService(premiumPricing, payment, inventory, notifier);
  const res2 = await checkout2.checkout({ cart: cart2, customerEmail: "vip@example.com", paymentMethodToken: "tok_master" });
  console.log("Checkout con PremiumMemberPricing:", res2);
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
