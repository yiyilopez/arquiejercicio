import { InventoryService } from "../../application/ports";

export class InMemoryInventory implements InventoryService {
  constructor(private stock: Record<string, number> = {}) {}

  async isInStock(productId: string, quantity: number): Promise<boolean> {
    return (this.stock[productId] ?? 0) >= quantity;
  }

  async reserve(productId: string, quantity: number): Promise<void> {
    const current = this.stock[productId] ?? 0;
    if (current < quantity) throw new Error("Insufficient stock");
    this.stock[productId] = current - quantity;
  }
}
