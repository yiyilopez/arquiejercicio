"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakePaymentProcessor = void 0;
class FakePaymentProcessor {
    constructor(shouldFail = false) {
        this.shouldFail = shouldFail;
    }
    async pay(amountCents, paymentMethodToken) {
        if (!paymentMethodToken)
            return { success: false, errorMessage: "Missing payment token" };
        // Simulate network delay
        await new Promise(r => setTimeout(r, 50));
        if (this.shouldFail)
            return { success: false, errorMessage: "Payment declined" };
        return { success: true, transactionId: `tx_${Date.now()}` };
    }
}
exports.FakePaymentProcessor = FakePaymentProcessor;
