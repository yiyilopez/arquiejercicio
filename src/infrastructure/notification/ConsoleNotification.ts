import { NotificationService } from "../../application/ports";

export class ConsoleNotification implements NotificationService {
  async send(to: string, message: string): Promise<void> {
    // In real life, send email/SMS; here we just log
    console.log(`[Notification to ${to}] ${message}`);
  }
}
