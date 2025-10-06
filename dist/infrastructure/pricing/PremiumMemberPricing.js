"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremiumMemberPricing = void 0;
// OCP/LSP: Alternative implementation interchangeable with SimplePricing
class PremiumMemberPricing {
    constructor(baseTaxRate = 0.21) {
        this.baseTaxRate = baseTaxRate;
    }
    calculateTotalCents(items) {
        const subtotal = items.reduce((sum, i) => sum + i.product.priceCents * i.quantity, 0);
        const memberDiscount = subtotal * 0.1; // flat 10% for members
        const taxed = (subtotal - memberDiscount) * (1 + this.baseTaxRate * 0.8); // 20% off taxes as a perk
        return Math.round(taxed);
    }
}
exports.PremiumMemberPricing = PremiumMemberPricing;
