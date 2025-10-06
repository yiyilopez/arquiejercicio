"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplePricing = void 0;
// SRP: Only concerned with price calculation
class SimplePricing {
    constructor(taxRate = 0.21, discountThresholdCents = 5000, discountRate = 0.05) {
        this.taxRate = taxRate;
        this.discountThresholdCents = discountThresholdCents;
        this.discountRate = discountRate;
    }
    calculateTotalCents(items) {
        const subtotal = items.reduce((sum, i) => sum + i.product.priceCents * i.quantity, 0);
        const discount = subtotal >= this.discountThresholdCents ? subtotal * this.discountRate : 0;
        const taxed = (subtotal - discount) * (1 + this.taxRate);
        return Math.round(taxed);
    }
}
exports.SimplePricing = SimplePricing;
