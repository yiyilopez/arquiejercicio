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
  const [isLoading, setIsLoading] = useState(false)

  console.log('App rendering, products:', products.length, 'cart items:', Object.keys(cart).length)

  // Following SOLID principles:
  // SRP: Each component has a single responsibility
  // OCP: Payment and pricing strategies are extensible
  // LSP: All pricing implementations are substitutable
  // ISP: Interfaces are segregated by client needs
  // DIP: Dependencies are injected, not hardcoded

  const total = useMemo(() =>
    Object.entries(cart).reduce((acc, [id, qty]) => {
      const p = products.find(p => p.id === id)
      return acc + (p?.priceCents ?? 0) * qty
    }, 0), [cart, products])

  useEffect(() => {
    setIsLoading(true)
    getProducts()
      .then(setProducts)
      .finally(() => setIsLoading(false))
  }, [])

  const addToCart = (id: string) => 
    setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }))

  const removeFromCart = (id: string) => 
    setCart(c => {
      const qty = (c[id] ?? 0) - 1
      if (qty <= 0) {
        const { [id]: _, ...rest } = c
        return rest
      }
      return { ...c, [id]: qty }
    })

  const checkout = async () => {
    if (Object.keys(cart).length === 0) return
    
    setIsLoading(true)
    try {
      const res = await postCheckout({ cart, email, paymentToken: token })
      if (res.ok) {
        setMsg(`✅ Order completed successfully! Transaction: ${res.transactionId}`)
        setCart({})
      }
    } catch (error: any) {
      setMsg(`❌ Checkout failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            SOLID E-Commerce Demo
          </h1>
          <p className="text-gray-600">
            A TypeScript implementation demonstrating SOLID principles
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Products Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Available Products
            </h2>
            
            {isLoading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map(product => (
                  <div key={product.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-800">{product.name}</h3>
                        <p className="text-lg font-semibold text-blue-600">
                          ${(product.priceCents / 100).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Cart Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Shopping Cart
            </h2>

            {Object.keys(cart).length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {Object.entries(cart).map(([id, qty]) => {
                    const product = products.find(p => p.id === id)
                    if (!product) return null
                    
                    return (
                      <div key={id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <span className="font-medium">{product.name}</span>
                          <span className="text-gray-600 ml-2">
                            ${(product.priceCents / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(id)}
                            className="text-gray-500 hover:text-gray-700 px-2 py-1 border rounded"
                          >
                            -
                          </button>
                          <span className="font-medium min-w-[2rem] text-center">{qty}</span>
                          <button
                            onClick={() => addToCart(id)}
                            className="text-gray-500 hover:text-gray-700 px-2 py-1 border rounded"
                          >
                            +
                          </button>
                          <button
                            onClick={() => setCart(c => { const {[id]: _, ...rest} = c; return rest })}
                            className="text-red-500 hover:text-red-700 px-2 py-1 border border-red-300 rounded ml-2"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-blue-600">${(total / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address:
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Token:
                    </label>
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Payment token"
                    />
                  </div>
                </div>

                <button
                  onClick={checkout}
                  disabled={Object.keys(cart).length === 0 || isLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isLoading ? 'Processing...' : 'Complete Checkout'}
                </button>
              </>
            )}

            {msg && (
              <div className="mt-4 p-3 rounded border-l-4 border-blue-500 bg-blue-50">
                <p className="text-sm text-blue-800">{msg}</p>
                <button
                  onClick={() => setMsg('')}
                  className="mt-1 text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Dismiss
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Educational Notes */}
        <footer className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            SOLID Principles Demonstrated
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>SRP:</strong> Each class has a single, well-defined responsibility</li>
            <li><strong>OCP:</strong> Pricing strategies are open for extension, closed for modification</li>
            <li><strong>LSP:</strong> All pricing implementations are substitutable</li>
            <li><strong>ISP:</strong> Interfaces are segregated by client needs (payment, inventory, notification)</li>
            <li><strong>DIP:</strong> High-level modules depend on abstractions, not concretions</li>
          </ul>
        </footer>
      </div>
    </div>
  )
}

export default App