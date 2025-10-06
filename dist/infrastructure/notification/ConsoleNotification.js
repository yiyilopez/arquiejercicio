"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleNotification = void 0;
class ConsoleNotification {
    async send(to, message) {
        // In real life, send email/SMS; here we just log
        console.log(`[Notification to ${to}] ${message}`);
    }
}
exports.ConsoleNotification = ConsoleNotification;
