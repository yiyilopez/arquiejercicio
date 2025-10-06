import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { getProducts, postCheckout } from './lib/api'

type Product = { id: string; name: string; priceCents: number }
type Cart = Record<string, number>

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Cart>({})
  const [email, setEmail] = useState('user@example.com')
  const [token, setToken] = useState('tok_demo')
  const [msg, setMsg] = useState<string>('')

  useEffect(() => {
    getProducts().then(setProducts).catch(e => setMsg('Error cargando productos: '+ e.message))
  }, [])

  const totalCents = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const p = products.find(x => x.id === id)
      return sum + (p ? p.priceCents * qty : 0)
    }, 0)
  }, [cart, products])

  const add = (id: string) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  const remove = (id: string) => setCart(prev => { const { [id]: _, ...rest } = prev; return rest })

  const fmt = (c: number) => `${(c/100).toFixed(2)}€`

  const checkout = async () => {
    const items = Object.entries(cart).map(([productId, quantity]) => ({ productId, quantity }))
    if (items.length === 0) { setMsg('Carrito vacío'); return }
    setMsg('Procesando pago...')
    try {
      const data = await postCheckout({ items, email, token })
      setCart({}); setMsg(`Pago ok: total ${(data.totalCents/100).toFixed(2)}€, tx ${data.transactionId}`)
    } catch (e: any) {
      setMsg('Error: '+ e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-6 grid gap-6 md:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-3xl font-bold mb-4">E-commerce SOLID</h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(p => (
              <div key={p.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-gray-600 mb-3">{fmt(p.priceCents)}</p>
                <button className="w-full rounded-md bg-blue-600 text-white py-2 hover:bg-blue-700" onClick={() => add(p.id)}>Agregar</button>
              </div>
            ))}
          </div>
        </div>
        <aside className="h-fit rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Carrito</h3>
          <div className="space-y-2">
            {Object.keys(cart).length === 0 && <p className="text-gray-500">Vacío</p>}
            {Object.entries(cart).map(([id, qty]) => {
              const p = products.find(x => x.id === id)
              if (!p) return null
              return (
                <div key={id} className="flex items-center justify-between gap-2">
                  <span>{p.name} x{qty}</span>
                  <span>{fmt(p.priceCents * qty)}</span>
                  <button className="text-sm text-red-600 hover:underline" onClick={() => remove(id)}>Quitar</button>
                </div>
              )
            })}
          </div>
          <p className="font-bold mt-3">Total: {fmt(totalCents)}</p>
          <input className="mt-3 w-full rounded border px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
          <input className="mt-2 w-full rounded border px-3 py-2" value={token} onChange={e => setToken(e.target.value)} placeholder="token (demo)" />
          <button className="mt-3 w-full rounded-md bg-emerald-600 text-white py-2 hover:bg-emerald-700 disabled:opacity-50" onClick={checkout} disabled={Object.keys(cart).length===0}>Pagar</button>
          <p className="text-gray-600 mt-2 min-h-[1.5rem]">{msg}</p>
        </aside>
      </div>
    </div>
  )
}

export default App
