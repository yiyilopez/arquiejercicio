import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";

import { Product } from "./domain/Product";
import { Cart } from "./domain/Cart";
import { SimplePricing } from "./infrastructure/pricing/SimplePricing";
import { InMemoryInventory } from "./infrastructure/inventory/InMemoryInventory";
import { FakePaymentProcessor } from "./infrastructure/payment/FakePaymentProcessor";
import { ConsoleNotification } from "./infrastructure/notification/ConsoleNotification";
import { CheckoutService } from "./application/CheckoutService";

const app = express();
app.use(cors());
app.use(express.json());

// Demo products
const products: Product[] = [
  { id: "p1", name: "Café en grano 1kg", priceCents: 1499 },
  { id: "p2", name: "Taza cerámica", priceCents: 999 },
  { id: "p3", name: "Filtro reusable", priceCents: 699 }
];

// Infra deps (reused across requests)
const inventory = new InMemoryInventory({ p1: 20, p2: 10, p3: 15 });
const notifier = new ConsoleNotification();
const payment = new FakePaymentProcessor(false);
const pricing = new SimplePricing(0.21, 2000, 0.05);

app.get("/api/products", (req: Request, res: Response) => {
  res.json(products);
});

app.post("/api/checkout", async (req: Request, res: Response) => {
  try {
    const { items, email, token } = req.body as { items: { productId: string; quantity: number }[]; email: string; token: string };
    if (!Array.isArray(items) || !email || !token) return res.status(400).json({ error: "Parámetros inválidos" });

    const cart = new Cart();
    for (const it of items) {
      const product = products.find(p => p.id === it.productId);
      if (!product) return res.status(400).json({ error: `Producto no encontrado: ${it.productId}` });
      cart.addItem(product, it.quantity);
    }

    const checkout = new CheckoutService(pricing, payment, inventory, notifier);
    const result = await checkout.checkout({ cart, customerEmail: email, paymentMethodToken: token });
    res.json({ ok: true, ...result });
  } catch (err: any) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// Healthcheck
app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

// Static frontend (legacy public + built React app for prod)
const publicDir = path.resolve(__dirname, "../public");
const reactDistDir = path.resolve(__dirname, "../frontend/dist");
app.use(express.static(publicDir));
app.use(express.static(reactDistDir));

// SPA fallback to React index.html (only for non-API routes)
app.get(/^\/(?!api).*/, (_req: Request, res: Response) => {
  const indexPath = path.join(reactDistDir, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      // fallback to simple public index when React build missing
      res.sendFile(path.join(publicDir, "index.html"));
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
