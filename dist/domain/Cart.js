"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
class Cart {
    constructor() {
        this.items = [];
    }
    addItem(product, quantity = 1) {
        if (quantity <= 0)
            throw new Error("Quantity must be > 0");
        const existing = this.items.find(i => i.product.id === product.id);
        if (existing)
            existing.quantity += quantity;
        else
            this.items.push({ product, quantity });
    }
    removeItem(productId) {
        this.items = this.items.filter(i => i.product.id !== productId);
    }
    getItems() {
        // return a copy to preserve encapsulation
        return this.items.map(i => ({ product: i.product, quantity: i.quantity }));
    }
}
exports.Cart = Cart;
