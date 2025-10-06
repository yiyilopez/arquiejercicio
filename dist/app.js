"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cart_1 = require("./domain/Cart");
const SimplePricing_1 = require("./infrastructure/pricing/SimplePricing");
const PremiumMemberPricing_1 = require("./infrastructure/pricing/PremiumMemberPricing");
const InMemoryInventory_1 = require("./infrastructure/inventory/InMemoryInventory");
const FakePaymentProcessor_1 = require("./infrastructure/payment/FakePaymentProcessor");
const ConsoleNotification_1 = require("./infrastructure/notification/ConsoleNotification");
const CheckoutService_1 = require("./application/CheckoutService");
async function main() {
    const coffee = { id: "p1", name: "Café en grano 1kg", priceCents: 1499 };
    const mug = { id: "p2", name: "Taza cerámica", priceCents: 999 };
    const cart = new Cart_1.Cart();
    cart.addItem(coffee, 2);
    cart.addItem(mug, 1);
    const inventory = new InMemoryInventory_1.InMemoryInventory({ p1: 10, p2: 5 });
    const notifier = new ConsoleNotification_1.ConsoleNotification();
    const payment = new FakePaymentProcessor_1.FakePaymentProcessor(false);
    // Try with SimplePricing
    const simplePricing = new SimplePricing_1.SimplePricing(0.21, 2000, 0.05);
    const checkout1 = new CheckoutService_1.CheckoutService(simplePricing, payment, inventory, notifier);
    const res1 = await checkout1.checkout({ cart, customerEmail: "user@example.com", paymentMethodToken: "tok_visa" });
    console.log("Checkout con SimplePricing:", res1);
    // Try with PremiumMemberPricing (LSP: interchangeability)
    const cart2 = new Cart_1.Cart();
    cart2.addItem(coffee, 1);
    cart2.addItem(mug, 2);
    const premiumPricing = new PremiumMemberPricing_1.PremiumMemberPricing(0.21);
    const checkout2 = new CheckoutService_1.CheckoutService(premiumPricing, payment, inventory, notifier);
    const res2 = await checkout2.checkout({ cart: cart2, customerEmail: "vip@example.com", paymentMethodToken: "tok_master" });
    console.log("Checkout con PremiumMemberPricing:", res2);
}
main().catch(err => {
    console.error("Error:", err.message);
    process.exit(1);
});
