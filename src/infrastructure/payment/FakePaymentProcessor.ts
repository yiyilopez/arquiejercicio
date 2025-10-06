import { PaymentProcessor, PaymentResult } from "../../application/ports";

export class FakePaymentProcessor implements PaymentProcessor {
  constructor(private shouldFail = false) {}

  async pay(amountCents: number, paymentMethodToken: string): Promise<PaymentResult> {
    if (!paymentMethodToken) return { success: false, errorMessage: "Missing payment token" };
    // Simulate network delay
    await new Promise(r => setTimeout(r, 50));
    if (this.shouldFail) return { success: false, errorMessage: "Payment declined" };
    return { success: true, transactionId: `tx_${Date.now()}` };
  }
}
