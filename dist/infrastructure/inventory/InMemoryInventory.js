"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryInventory = void 0;
class InMemoryInventory {
    constructor(stock = {}) {
        this.stock = stock;
    }
    async isInStock(productId, quantity) {
        return (this.stock[productId] ?? 0) >= quantity;
    }
    async reserve(productId, quantity) {
        const current = this.stock[productId] ?? 0;
        if (current < quantity)
            throw new Error("Insufficient stock");
        this.stock[productId] = current - quantity;
    }
}
exports.InMemoryInventory = InMemoryInventory;
