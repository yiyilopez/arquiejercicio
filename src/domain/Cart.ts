import { Product } from "./Product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export class Cart {
  private items: CartItem[] = [];

  addItem(product: Product, quantity: number = 1) {
    if (quantity <= 0) throw new Error("Quantity must be > 0");
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) existing.quantity += quantity;
    else this.items.push({ product, quantity });
  }

  removeItem(productId: string) {
    this.items = this.items.filter(i => i.product.id !== productId);
  }

  getItems(): CartItem[] {
    // return a copy to preserve encapsulation
    return this.items.map(i => ({ product: i.product, quantity: i.quantity }));
  }
}
