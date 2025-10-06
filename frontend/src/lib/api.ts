const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function getProducts() {
  const r = await fetch(`${API_BASE}/products`);
  if (!r.ok) throw new Error(`GET /products ${r.status}`);
  return r.json();
}

export async function postCheckout(body: any) {
  const r = await fetch(`${API_BASE}/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await r.json();
  if (!r.ok || !data.ok) throw new Error(data.error || 'Checkout failed');
  return data as { ok: true; totalCents: number; transactionId: string };
}
